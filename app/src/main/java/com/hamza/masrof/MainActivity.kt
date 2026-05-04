package com.hamza.masrof

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.work.Data
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.button.MaterialButton
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.Calendar
import java.util.UUID
import java.util.concurrent.TimeUnit

// Expert Corrected and Refined Version
class MainActivity : AppCompatActivity() {

    private var currentBalance = 0.0
    private var transactions = mutableListOf<Transaction>()
    
    private lateinit var balanceText: TextView
    private lateinit var weeklyAchat: TextView
    private lateinit var weeklyBank: TextView
    private lateinit var monthlyBank: TextView
    private lateinit var monthlyStats: TextView
    private lateinit var bottomNav: com.google.android.material.bottomnavigation.BottomNavigationView

    private val gson = Gson()
    private val PREFS_NAME = "Masrof_Expert_Prefs"
    private val KEY_DATA = "expert_transactions"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Binding - Using explicit casts to solve type inference issues
        balanceText = findViewById(R.id.balanceText) as TextView
        weeklyAchat = findViewById(R.id.weeklyAchat) as TextView
        weeklyBank = findViewById(R.id.weeklyBank) as TextView
        monthlyBank = findViewById(R.id.monthlyBank) as TextView
        monthlyStats = findViewById(R.id.monthlyStats) as TextView
        bottomNav = findViewById(R.id.bottomNav) as com.google.android.material.bottomnavigation.BottomNavigationView

        findViewById<MaterialButton>(R.id.btnBank).setOnClickListener { showTransactionDialog(TransactionType.INCOME) }
        findViewById<MaterialButton>(R.id.btnPurchase).setOnClickListener { showTransactionDialog(TransactionType.EXPENSE) }
        
        bottomNav.setOnItemSelectedListener { item: android.view.MenuItem ->
            when(item.itemId) {
                R.id.nav_home -> { true }
                R.id.nav_history -> { Toast.makeText(this, "Historique à venir", Toast.LENGTH_SHORT).show(); true }
                R.id.nav_stats -> { Toast.makeText(this, "Analyses à venir", Toast.LENGTH_SHORT).show(); true }
                R.id.nav_settings -> { confirmReset(); true }
                else -> false
            }
        }

        loadData()
        updateUI()
        
        setupExpertNotifications()
        checkNotificationPermission()
    }

    private fun checkNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.POST_NOTIFICATIONS), 101)
            }
        }
    }

    private fun setupExpertNotifications() {
        val workManager = WorkManager.getInstance(this)
        scheduleNotification(workManager, "MORNING", 7, 45)
        scheduleNotification(workManager, "EVENING", 22, 0)
    }

    private fun scheduleNotification(workManager: WorkManager, type: String, hour: Int, minute: Int) {
        val calendar = Calendar.getInstance()
        val now = calendar.timeInMillis
        calendar.set(Calendar.HOUR_OF_DAY, hour)
        calendar.set(Calendar.MINUTE, minute)
        calendar.set(Calendar.SECOND, 0)
        
        if (calendar.timeInMillis <= now) {
            calendar.add(Calendar.DAY_OF_YEAR, 1)
        }
        
        val delay = calendar.timeInMillis - now
        val data = Data.Builder().putString("type", type).build()
        
        val request = PeriodicWorkRequestBuilder<NotificationWorker>(24, TimeUnit.HOURS)
            .setInitialDelay(delay, TimeUnit.MILLISECONDS)
            .setInputData(data)
            .build()

        workManager.enqueueUniquePeriodicWork("Masrof_Notif_$type", ExistingPeriodicWorkPolicy.KEEP, request)
    }

    private fun showTransactionDialog(type: TransactionType) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_transaction, null)
        val title = if (type == TransactionType.INCOME) "Rentrée d'Argent" else "Sortie de Caisse"
        val inputName = dialogView.findViewById<EditText>(R.id.inputName)
        val inputAmount = dialogView.findViewById<EditText>(R.id.inputAmount)

        AlertDialog.Builder(this)
            .setTitle(title)
            .setView(dialogView)
            .setPositiveButton("Valider") { _, _ ->
                val name = inputName.text.toString().ifEmpty { if (type == TransactionType.INCOME) "Revenu" else "Dépense" }
                val amount = inputAmount.text.toString().toDoubleOrNull() ?: 0.0
                if (amount > 0) {
                    addTransaction(name, amount, type)
                }
            }
            .setNegativeButton("Fermer", null)
            .show()
    }

    private fun addTransaction(label: String, amount: Double, type: TransactionType) {
        transactions.add(0, Transaction(label = label, amount = amount, type = type))
        calculateBalance()
        saveData()
        updateUI()
        MasrofWidgetProvider.triggerUpdate(this)
    }

    private fun calculateBalance() {
        val income = transactions.filter { it.type == TransactionType.INCOME }.sumOf { it.amount }
        val expense = transactions.filter { it.type == TransactionType.EXPENSE }.sumOf { it.amount }
        currentBalance = income - expense
    }

    private fun updateUI() {
        balanceText.text = String.format("%.2f DH", currentBalance)
        
        val calendar = Calendar.getInstance()
        val now = calendar.timeInMillis
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        
        // Weekly
        calendar.set(Calendar.DAY_OF_WEEK, calendar.firstDayOfWeek)
        val startOfWeek = calendar.timeInMillis
        
        // Monthly
        calendar.set(Calendar.DAY_OF_MONTH, 1)
        val startOfMonth = calendar.timeInMillis

        val weeklyExp = transactions.filter { it.type == TransactionType.EXPENSE && it.timestamp >= startOfWeek }.sumOf { it.amount }
        val weeklyInc = transactions.filter { it.type == TransactionType.INCOME && it.timestamp >= startOfWeek }.sumOf { it.amount }
        
        val monthlyExp = transactions.filter { it.type == TransactionType.EXPENSE && it.timestamp >= startOfMonth }.sumOf { it.amount }
        val monthlyInc = transactions.filter { it.type == TransactionType.INCOME && it.timestamp >= startOfMonth }.sumOf { it.amount }

        weeklyAchat.text = String.format("%.0f DH", weeklyExp)
        weeklyBank.text = String.format("%.0f DH", weeklyInc)
        
        monthlyBank.text = String.format("%.0f DH", monthlyInc)
        monthlyStats.text = String.format("%.0f DH", monthlyExp)
    }

    private fun confirmReset() {
        AlertDialog.Builder(this)
            .setTitle("Réinitialisation")
            .setMessage("Voulez-vous effacer tout le Grand Livre ?")
            .setPositiveButton("Confirmer") { _, _ ->
                transactions.clear()
                currentBalance = 0.0
                saveData()
                updateUI()
                MasrofWidgetProvider.triggerUpdate(this)
            }
            .setNegativeButton("Annuler", null)
            .show()
    }

    private fun saveData() {
        val json = gson.toJson(transactions)
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit().putString(KEY_DATA, json).apply()
    }

    private fun loadData() {
        val json = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).getString(KEY_DATA, null)
        if (json != null) {
            val type = object : TypeToken<MutableList<Transaction>>() {}.type
            transactions = gson.fromJson(json, type)
            calculateBalance()
        }
    }
}
