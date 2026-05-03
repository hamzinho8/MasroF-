package com.hamza.masrof

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class NotificationWorker(context: Context, params: WorkerParameters) : Worker(context, params) {

    override fun doWork(): Result {
        val type = inputData.getString("type") ?: return Result.failure()
        
        when (type) {
            "MORNING" -> checkBalanceAndNotify()
            "EVENING" -> sendReminderToEntry()
        }
        
        return Result.success()
    }

    private fun checkBalanceAndNotify() {
        val prefs = applicationContext.getSharedPreferences("Masrof_Expert_Prefs", Context.MODE_PRIVATE)
        val json = prefs.getString("expert_transactions", null)
        var balance = 0.0
        
        if (json != null) {
            val listType = object : TypeToken<MutableList<Transaction>>() {}.type
            val transactions: List<Transaction> = Gson().fromJson(json, listType)
            val income = transactions.filter { it.type == TransactionType.INCOME }.sumOf { it.amount }
            val expense = transactions.filter { it.type == TransactionType.EXPENSE }.sumOf { it.amount }
            balance = income - expense
        }

        if (balance <= 50.0) {
            sendNotification(
                "Alerte Trésorerie ⚠️",
                "Votre solde est de ${String.format("%.2f", balance)} DH. Pensez à retirer de l'argent pour la journée.",
                101
            )
        }
    }

    private fun sendReminderToEntry() {
        sendNotification(
            "Clôture du Grand Livre 📖",
            "N'oubliez pas de saisir vos achats d'aujourd'hui pour garder une comptabilité précise.",
            102
        )
    }

    private fun sendNotification(title: String, message: String, id: Int) {
        val channelId = "masrof_notifications"
        val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Rappels MasroF", NotificationManager.IMPORTANCE_DEFAULT)
            notificationManager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(applicationContext, channelId)
            .setSmallIcon(R.drawable.ic_transaction)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .build()

        notificationManager.notify(id, notification)
    }
}
