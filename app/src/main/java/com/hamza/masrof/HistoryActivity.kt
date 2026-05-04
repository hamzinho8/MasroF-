package com.hamza.masrof

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class HistoryActivity : AppCompatActivity() {

    private lateinit var rvHistory: RecyclerView
    private var transactions = mutableListOf<Transaction>()
    private val gson = Gson()
    private val PREFS_NAME = "Masrof_Expert_Prefs"
    private val KEY_DATA = "expert_transactions"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_history)

        rvHistory = findViewById(R.id.rvHistory)
        val toolbar = findViewById<androidx.appcompat.widget.Toolbar>(R.id.toolbarHistory)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener { finish() }

        loadData()
        setupRecyclerView()
    }

    private fun loadData() {
        val json = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).getString(KEY_DATA, null)
        if (json != null) {
            val listType = object : TypeToken<MutableList<Transaction>>() {}.type
            transactions = gson.fromJson(json, listType)
        }
    }

    private fun saveData() {
        val json = gson.toJson(transactions)
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit().putString(KEY_DATA, json).apply()
        MasrofWidgetProvider.triggerUpdate(this)
    }

    private fun setupRecyclerView() {
        rvHistory.layoutManager = LinearLayoutManager(this)
        rvHistory.adapter = HistoryAdapter(transactions) { transaction ->
            toggleImportant(transaction)
        }
    }

    private fun toggleImportant(transaction: Transaction) {
        val index = transactions.indexOfFirst { it.id == transaction.id }
        if (index != -1) {
            val updated = transactions[index].copy(isImportant = !transactions[index].isImportant)
            transactions[index] = updated
            saveData()
            rvHistory.adapter?.notifyItemChanged(index)
        }
    }

    inner class HistoryAdapter(
        private val items: List<Transaction>,
        private val onLongClick: (Transaction) -> Unit
    ) : RecyclerView.Adapter<HistoryAdapter.ViewHolder>() {

        class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
            val label: TextView = view.findViewById(R.id.itemLabel)
            val date: TextView = view.findViewById(R.id.itemDate)
            val amount: TextView = view.findViewById(R.id.itemAmount)
            val icon: ImageView = view.findViewById(R.id.itemIcon)
            val imgImportant: ImageView = view.findViewById(R.id.imgImportant)
            val container: View = view.findViewById(android.R.id.content) ?: view // fallback
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.item_transaction, parent, false)
            return ViewHolder(view)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val item = items[position]
            holder.label.text = item.label
            val sdf = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault())
            holder.date.text = sdf.format(Date(item.timestamp))
            
            val sign = if (item.type == TransactionType.INCOME) "+" else "-"
            holder.amount.text = String.format("%s %.2f DH", sign, item.amount)
            holder.amount.textColor = ContextCompat.getColor(
                holder.itemView.context, 
                if (item.type == TransactionType.INCOME) R.color.liquid_green else R.color.danger_red
            )

            holder.icon.setImageResource(if (item.type == TransactionType.INCOME) R.drawable.ic_plus else R.drawable.ic_cart)
            holder.icon.setTint(ContextCompat.getColor(
                holder.itemView.context,
                if (item.type == TransactionType.INCOME) R.color.bank_blue else R.color.rose_600
            ))

            // Show important indicator
            holder.imgImportant.visibility = if (item.isImportant) View.VISIBLE else View.GONE
            
            // Highlight important with background color if requested
            if (item.isImportant) {
                holder.itemView.setBackgroundColor(ContextCompat.getColor(holder.itemView.context, R.color.teal_light))
            } else {
                holder.itemView.setBackgroundColor(ContextCompat.getColor(holder.itemView.context, R.color.white))
            }

            holder.itemView.setOnLongClickListener {
                onLongClick(item)
                true
            }
        }

        override fun getItemCount() = items.size
        
        // Extension property to fix color setting on TextView
        private var TextView.textColor: Int
            get() = currentTextColor
            set(value) = setTextColor(value)

        private fun ImageView.setTint(color: Int) {
            setColorFilter(color)
        }
    }
}
