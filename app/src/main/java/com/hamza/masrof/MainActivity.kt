package com.hamza.masrof

import android.Manifest
import android.content.Context
import android.content.Intent
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
import java.util.concurrent.TimeUnit
import com.hamza.masrof.R

// Expert Refined Main Activity - Robust Version with Explicit Types to solve build errors
class MainActivity : AppCompatActivity() {

    private var currentBalance: Double = 0.0
    private var transactions: MutableList<Transaction> = mutableListOf<Transaction>()
    
    // Explicit declarations to avoid inference issues in strict environments
    private lateinit var balanceText: TextView
    private lateinit var weeklyAchat: TextView
    private lateinit var weeklyBank: TextView
    private lateinit var monthlyBank: TextView
    private lateinit var monthlyStats: TextView
    private lateinit var bottomNav: BottomNavigationView

    private val gson: Gson = Gson()
    private val PREFS_NAME: String = "Masrof_Expert_Prefs"
    private val KEY_DATA: String = "expert_transactions"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Binding with explicit types as requested
        balanceText = findViewById<TextView>(R.id.balanceText)
        weeklyAchat = findViewById<TextView>(R.id.weeklyAchat)
        weeklyBank = findViewById<TextView>(R.id.weeklyBank)
        monthlyBank = findViewById<TextView>(R.id.monthlyBank)
        monthlyStats = findViewById<TextView>(R.id.monthlyStats)
        bottomNav = findViewById<BottomNavigationView>(R.id.bottomNav)

        // Click listeners with explicit View types
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
                    val intent = Intent(this, HistoryActivity::class.java)
                    startActivity(intent)
                    true 
                }
                R.id.nav_stats -> { 
                    showImportantStats()
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

    private fun showImportantStats() {
        val important: List<Transaction> = transactions.filter { it.isImportant }
        val count: Int = important.size
        val total: Double = important.sumOf { it.amount }
        
        AlertDialog.Builder(this)
            .setTitle("Transactions Importantes")
            .setMessage("Vous avez $count transactions marquées comme importantes.\nTotal : ${String.format("%.2f DH", total)}")
            .setPositiveButton("OK", null)
            .show()
    }

    private fun checkNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val permission: String = Manifest.permission.POST_NOTIFICATIONS
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, arrayOf(permission), 101)
            }
        }
    }

    private fun setupExpertNotifications() {
        try {
            val context: Context = applicationContext
            val workManager: WorkManager = WorkManager.getInstance(context)
            scheduleNotification(workManager, "MORNING", 7, 45)
            scheduleNotification(workManager, "EVENING", 22, 0)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun scheduleNotification(workManager: WorkManager, type: String, hour: Int, minute: Int) {
        val calendar: Calendar = Calendar.getInstance()
        val now: Long = calendar.timeInMillis
        calendar.set(Calendar.HOUR_OF_DAY, hour)
        calendar.set(Calendar.MINUTE, minute)
        calendar.set(Calendar.SECOND, 0)
        
        if (calendar.timeInMillis <= now) {
            calendar.add(Calendar.DAY_OF_YEAR, 1)
        }
        
        val delay: Long = calendar.timeInMillis - now
        val data: Data = Data.Builder().putString("type", type).build()
        
        val request = PeriodicWorkRequestBuilder<NotificationWorker>(24, TimeUnit.HOURS)
            .setInitialDelay(delay, TimeUnit.MILLISECONDS)
            .setInputData(data)
            .build()

        workManager.enqueueUniquePeriodicWork("Masrof_Notif_$type", ExistingPeriodicWorkPolicy.KEEP, request)
    }

    private fun showTransactionDialog(type: TransactionType) {
        val dialogView: View = LayoutInflater.from(this).inflate(R.layout.dialog_transaction, null)
        val title: String = if (type == TransactionType.INCOME) "Rentrée d'Argent" else "Sortie de Caisse"
        
        val inputName: EditText = dialogView.findViewById<EditText>(R.id.inputName)
        val inputAmount: EditText = dialogView.findViewById<EditText>(R.id.inputAmount)
        val chipGroup: ChipGroup = dialogView.findViewById<ChipGroup>(R.id.chipGroupCategory)
        val lblCategory: TextView = dialogView.findViewById<TextView>(R.id.lblCategory)
        val categoryScroll: View = dialogView.findViewById<View>(R.id.categoryScroll)

        if (type == TransactionType.INCOME) {
            lblCategory.visibility = View.GONE
            categoryScroll.visibility = View.GONE
        }

        AlertDialog.Builder(this)
            .setTitle(title)
            .setView(dialogView)
            .setPositiveButton("Valider") { _, _ ->
                val name: String = inputName.text.toString().ifEmpty { 
                    if (type == TransactionType.INCOME) "Revenu" else "Dépense" 
                }
                val amountStr: String = inputAmount.text.toString()
                val amount: Double = amountStr.toDoubleOrNull() ?: 0.0
                
                val category: String = if (type == TransactionType.INCOME) "Banque" else {
                    val checkedChipId: Int = chipGroup.checkedChipId
                    val chip: Chip? = dialogView.findViewById<Chip>(checkedChipId)
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
        val income: Double = transactions.filter { it.type == TransactionType.INCOME }.sumOf { it.amount }
        val expense: Double = transactions.filter { it.type == TransactionType.EXPENSE }.sumOf { it.amount }
        currentBalance = income - expense
    }

    private fun updateUI() {
        balanceText.text = String.format("%.2f DH", currentBalance)
        
        val calendar: Calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        
        val calWeek: Calendar = calendar.clone() as Calendar
        calWeek.set(Calendar.DAY_OF_WEEK, calWeek.firstDayOfWeek)
        val startOfWeek: Long = calWeek.timeInMillis
        
        val calMonth: Calendar = calendar.clone() as Calendar
        calMonth.set(Calendar.DAY_OF_MONTH, 1)
        val startOfMonth: Long = calMonth.timeInMillis

        val weeklyExp: Double = transactions.filter { it.type == TransactionType.EXPENSE && it.timestamp >= startOfWeek }.sumOf { it.amount }
        val weeklyInc: Double = transactions.filter { it.type == TransactionType.INCOME && it.timestamp >= startOfWeek }.sumOf { it.amount }
        
        val monthlyExp: Double = transactions.filter { it.type == TransactionType.EXPENSE && it.timestamp >= startOfMonth }.sumOf { it.amount }
        val monthlyInc: Double = transactions.filter { it.type == TransactionType.INCOME && it.timestamp >= startOfMonth }.sumOf { it.amount }

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
        val json: String = gson.toJson(transactions)
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit().putString(KEY_DATA, json).apply()
    }

    private fun loadData() {
        val json: String? = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).getString(KEY_DATA, null)
        if (json != null) {
            val listType = object : TypeToken<MutableList<Transaction>>() {}.type
            transactions = gson.fromJson<MutableList<Transaction>>(json, listType)
            calculateBalance()
        }
    }
}
