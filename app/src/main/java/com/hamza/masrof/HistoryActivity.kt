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
    private lateinit var rvCategories: RecyclerView
    private var allTransactions = mutableListOf<Transaction>()
    private var filteredTransactions = mutableListOf<Transaction>()
    private var categories = mutableListOf<Category>()
    private var selectedCategoryName: String = "Toutes"

    private val gson = Gson()
    private val PREFS_NAME = "Masrof_Expert_Prefs"
    private val KEY_DATA = "expert_transactions"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_history)

        rvHistory = findViewById<RecyclerView>(R.id.rvHistory)
        rvCategories = findViewById<RecyclerView>(R.id.rvCategories)
        
        val toolbar = findViewById<androidx.appcompat.widget.Toolbar>(R.id.toolbarHistory)
        setSupportActionBar(toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toolbar.setNavigationOnClickListener { finish() }

        setupCategories()
        loadData()
        setupRecyclerViews()
    }

    private fun setupCategories() {
        categories = mutableListOf(
            Category("Toutes", R.drawable.ic_all, true),
            Category("Banque", R.drawable.ic_bank),
            Category("Alimentation", R.drawable.ic_cart),
            Category("Transport", R.drawable.ic_transport),
            Category("Shopping", R.drawable.ic_shopping),
            Category("Loisirs", R.drawable.ic_fun),
            Category("Autres", R.drawable.ic_verified)
        )
    }

    private fun loadData() {
        val json = getSharedPreferences(PREFS_NAME, MODE_PRIVATE).getString(KEY_DATA, null)
        if (json != null) {
            val listType = object : TypeToken<MutableList<Transaction>>() {}.type
            allTransactions = gson.fromJson(json, listType)
            applyFilter()
        }
    }

    private fun applyFilter() {
        filteredTransactions.clear()
        if (selectedCategoryName == "Toutes") {
            filteredTransactions.addAll(allTransactions)
        } else {
            filteredTransactions.addAll(allTransactions.filter { it.category == selectedCategoryName })
        }
        rvHistory.adapter?.notifyDataSetChanged()
    }

    private fun saveData() {
        val json = gson.toJson(allTransactions)
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE).edit().putString(KEY_DATA, json).apply()
        MasrofWidgetProvider.triggerUpdate(this)
    }

    private fun setupRecyclerViews() {
        // Categories - Using a 2-row horizontal Grid Layout as requested
        val gridLayoutManager = androidx.recyclerview.widget.GridLayoutManager(this, 2, androidx.recyclerview.widget.GridLayoutManager.HORIZONTAL, false)
        rvCategories.layoutManager = gridLayoutManager
        rvCategories.adapter = CategoryAdapter(categories) { category ->
            onCategorySelected(category)
        }

        // Transactions
        rvHistory.layoutManager = LinearLayoutManager(this)
        rvHistory.adapter = HistoryAdapter(filteredTransactions) { transaction ->
            toggleImportant(transaction)
        }
    }

    private fun onCategorySelected(category: Category) {
        categories.forEach { it.isSelected = (it.name == category.name) }
        selectedCategoryName = category.name
        rvCategories.adapter?.notifyDataSetChanged()
        applyFilter()
    }

    private fun toggleImportant(transaction: Transaction) {
        val indexInAll = allTransactions.indexOfFirst { it.id == transaction.id }
        if (indexInAll != -1) {
            val updated = allTransactions[indexInAll].copy(isImportant = !allTransactions[indexInAll].isImportant)
            allTransactions[indexInAll] = updated
            saveData()
            
            val indexInFiltered = filteredTransactions.indexOfFirst { it.id == transaction.id }
            if (indexInFiltered != -1) {
                filteredTransactions[indexInFiltered] = updated
                rvHistory.adapter?.notifyItemChanged(indexInFiltered)
            }
        }
    }

    // Category Adapter
    inner class CategoryAdapter(
        private val items: List<Category>,
        private val onClick: (Category) -> Unit
    ) : RecyclerView.Adapter<CategoryAdapter.ViewHolder>() {

        class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
            val card: com.google.android.material.card.MaterialCardView = view.findViewById<com.google.android.material.card.MaterialCardView>(R.id.categoryCard)
            val icon: ImageView = view.findViewById<ImageView>(R.id.categoryIcon)
            val name: TextView = view.findViewById<TextView>(R.id.categoryName)
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
            val view = LayoutInflater.from(parent.context).inflate(R.layout.item_category, parent, false)
            return ViewHolder(view)
        }

        override fun onBindViewHolder(holder: ViewHolder, position: Int) {
            val item = items[position]
            holder.name.text = item.name
            holder.icon.setImageResource(item.iconRes)

            val colorBrand = ContextCompat.getColor(holder.itemView.context, R.color.teal_brand)
            val colorSlate = ContextCompat.getColor(holder.itemView.context, R.color.slate_500)
            val colorWhite = ContextCompat.getColor(holder.itemView.context, R.color.white)

            if (item.isSelected) {
                holder.card.strokeColor = colorBrand
                holder.card.setCardBackgroundColor(ContextCompat.getColor(holder.itemView.context, R.color.teal_light))
                holder.name.setTextColor(colorBrand)
                holder.icon.setColorFilter(colorBrand)
            } else {
                holder.card.strokeColor = ContextCompat.getColor(holder.itemView.context, R.color.slate_200)
                holder.card.setCardBackgroundColor(colorWhite)
                holder.name.setTextColor(colorSlate)
                holder.icon.setColorFilter(colorSlate)
            }

            holder.itemView.setOnClickListener { onClick(item) }
        }

        override fun getItemCount() = items.size
    }

    data class Category(val name: String, val iconRes: Int, var isSelected: Boolean = false)

    inner class HistoryAdapter(
        private val items: List<Transaction>,
        private val onLongClick: (Transaction) -> Unit
    ) : RecyclerView.Adapter<HistoryAdapter.ViewHolder>() {

        class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
            val label: TextView = view.findViewById<TextView>(R.id.itemLabel)
            val date: TextView = view.findViewById<TextView>(R.id.itemDate)
            val amount: TextView = view.findViewById<TextView>(R.id.itemAmount)
            val icon: ImageView = view.findViewById<ImageView>(R.id.itemIcon)
            val imgImportant: ImageView = view.findViewById<ImageView>(R.id.imgImportant)
            val container: View = view.findViewById<View>(android.R.id.content) ?: view // fallback
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

            // Show the specific category icon
            val catIcon = categories.find { it.name == item.category }?.iconRes ?: R.drawable.ic_verified
            holder.icon.setImageResource(catIcon)
            
            holder.icon.setColorFilter(ContextCompat.getColor(
                holder.itemView.context,
                if (item.type == TransactionType.INCOME) R.color.teal_brand else R.color.rose_600
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
