package com.hamza.masrof

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.card.MaterialCardView

class CategoryAdapter(
    private val items: List<Category>,
    private val onClick: (Category) -> Unit
) : RecyclerView.Adapter<CategoryAdapter.ViewHolder>() {

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val card: MaterialCardView = view.findViewById<MaterialCardView>(R.id.categoryCard)
        val icon: ImageView = view.findViewById<ImageView>(R.id.categoryIcon)
        val name: TextView = view.findViewById<TextView>(R.id.categoryName)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_category, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item: Category = items[position]
        holder.name.text = item.name
        holder.icon.setImageResource(item.iconRes)

        val context = holder.itemView.context
        val colorBrand: Int = ContextCompat.getColor(context, R.color.teal_brand)
        val colorSlate: Int = ContextCompat.getColor(context, R.color.slate_500)
        val colorWhite: Int = ContextCompat.getColor(context, R.color.white)

        if (item.isSelected) {
            holder.card.strokeColor = colorBrand
            holder.card.setCardBackgroundColor(ContextCompat.getColor(context, R.color.teal_light))
            holder.name.setTextColor(colorBrand)
            holder.icon.setColorFilter(colorBrand)
        } else {
            holder.card.strokeColor = ContextCompat.getColor(context, R.color.slate_200)
            holder.card.setCardBackgroundColor(colorWhite)
            holder.name.setTextColor(colorSlate)
            holder.icon.setColorFilter(colorSlate)
        }

        holder.itemView.setOnClickListener { onClick(item) }
    }

    override fun getItemCount(): Int = items.size
}
