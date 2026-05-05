package com.hamza.masrof

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class HistoryAdapter(
    private val items: List<Transaction>,
    private val onImportantClick: (Transaction) -> Unit,
    private val onLongClick: (Transaction) -> Unit
) : RecyclerView.Adapter<HistoryAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val label: TextView = view.findViewById<TextView>(R.id.itemLabel)
        val date: TextView = view.findViewById<TextView>(R.id.itemDate)
        val amount: TextView = view.findViewById<TextView>(R.id.itemAmount)
        val icon: ImageView = view.findViewById<ImageView>(R.id.itemIcon)
        val imgImportant: ImageView = view.findViewById<ImageView>(R.id.imgImportant)
        val root: View = view.findViewById<View>(R.id.transactionRoot) ?: view
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_transaction, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item: Transaction = items[position]
        val context = holder.itemView.context

        holder.label.text = item.label
        val sdf = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault())
        holder.date.text = sdf.format(Date(item.timestamp))
        
        val prefix: String = if (item.type == TransactionType.INCOME) "+" else "-"
        holder.amount.text = String.format("%s %.2f DH", prefix, item.amount)
        holder.amount.setTextColor(
            ContextCompat.getColor(context, if (item.type == TransactionType.INCOME) R.color.liquid_green else R.color.danger_red)
        )

        // Gestion de l'icône selon la catégorie
        holder.icon.setImageResource(getIconForCategory(item.category))
        holder.icon.setColorFilter(
            ContextCompat.getColor(context, if (item.type == TransactionType.INCOME) R.color.teal_brand else R.color.rose_600)
        )

        // Étoile important
        holder.imgImportant.setImageResource(R.drawable.ic_star)
        holder.imgImportant.alpha = if (item.isImportant) 1.0f else 0.2f
        holder.imgImportant.setColorFilter(ContextCompat.getColor(context, if (item.isImportant) R.color.teal_brand else R.color.slate_500))

        holder.imgImportant.setOnClickListener { onImportantClick(item) }

        // Nouveau : Support du clic long pour modifier/supprimer
        holder.itemView.setOnLongClickListener {
            onLongClick(item)
            true
        }
    }

    private fun getIconForCategory(category: String): Int {
        return when (category) {
            "Banque" -> R.drawable.ic_bank
            "Alimentation" -> R.drawable.ic_cart
            "Transport" -> R.drawable.ic_transport
            "Shopping" -> R.drawable.ic_shopping
            "Loisirs" -> R.drawable.ic_fun
            else -> R.drawable.ic_verified
        }
    }

    override fun getItemCount(): Int = items.size
}
