package com.hamza.masrof

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
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
import com.google.android.material.card.MaterialCardView
import com.google.android.material.chip.Chip
import com.google.android.material.chip.ChipGroup
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.Calendar
import java.util.UUID
import java.util.concurrent.TimeUnit
import com.hamza.masrof.R

// Expert Refined Main Activity
class MainActivity : AppCompatActivity() {

    private var currentBalance = 0.0
    private var transactions = mutableListOf<Transaction>()
    
    // Explicitly declaring types - using fully qualified names for the most critical one if needed
    private lateinit var balanceText: TextView
    private lateinit var weeklyAchat: TextView
    private lateinit var weeklyBank: TextView
    private lateinit var monthlyBank: TextView
    private lateinit var monthlyStats: TextView
    private lateinit var bottomNav: BottomNavigationView

    private val gson: Gson = Gson()
    private val PREFS_NAME = "Masrof_Expert_Prefs"
    private val KEY_DATA = "expert_transactions"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Binding - Explicitly typed
        balanceText = findViewById<TextView>(R.id.balanceText)
        weeklyAchat = findViewById<TextView>(R.id.weeklyAchat)
        weeklyBank = findViewById<TextView>(R.id.weeklyBank)
        monthlyBank = findViewById<TextView>(R.id.monthlyBank)
        monthlyStats = findViewById<TextView>(R.id.monthlyStats)
        bottomNav = findViewById<BottomNavigationView>(R.id.bottomNav)

        // Button Click Listeners
        findViewById<MaterialCardView>(R.id.cardBank).setOnClickListener { 
            showTransactionDialog(TransactionType.INCOME) 
        }
        findViewById<MaterialCardView>(R.id.cardPurchase).setOnClickListener { 
            showTransactionDialog(TransactionType.EXPENSE) 
        }
        
        bottomNav.setOnItemSelectedListener { item: MenuItem ->
            when(item.itemId) {
                R.id.nav_home -> true
                R.id.nav_history -> { 
                    Toast.makeText(this, "Historique à venir", Toast.LENGTH_SHORT).show()
                    true 
                }
                R.id.nav_stats -> { 
                    Toast.makeText(this, "Analyses à venir", Toast.LENGTH_SHORT).show()
                    true 
                }
                R.id.nav_settings -> { 
                    confirmReset()
                    true 
                }
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
        val chipGroup = dialogView.findViewById<ChipGroup>(R.id.chipGroupCategory)
        val lblCategory = dialogView.findViewById<TextView>(R.id.lblCategory)
        val categoryScroll = dialogView.findViewById<View>(R.id.categoryScroll)

        // Hide category selection for INCOME (transfers from bank don't usually need categories like food/shopping)
        if (type == TransactionType.INCOME) {
            lblCategory.visibility = View.GONE
            categoryScroll.visibility = View.GONE
        }

        AlertDialog.Builder(this)
            .setTitle(title)
            .setView(dialogView)
            .setPositiveButton("Valider") { _, _ ->
                val name = inputName.text.toString().ifEmpty { if (type == TransactionType.INCOME) "Revenu" else "Dépense" }
                val amount = inputAmount.text.toString().toDoubleOrNull() ?: 0.0
                
                val category = if (type == TransactionType.INCOME) "Banque" else {
                    val checkedChipId = chipGroup.checkedChipId
                    val chip = dialogView.findViewById<Chip>(checkedChipId)
                    chip?.text?.toString() ?: "Autres"
                }

                if (amount > 0) {
                    addTransaction(name, amount, type, category)
                }
            }
            .setNegativeButton("Fermer", null)
            .show()
    }

    private fun addTransaction(label: String, amount: Double, type: TransactionType, category: String) {
        transactions.add(0, Transaction(label = label, amount = amount, type = type, category = category))
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
