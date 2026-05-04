package com.hamza.masrof

import com.google.gson.annotations.SerializedName

/**
 * Modèles de données officiels pour MasroF
 */
enum class TransactionType {
    @SerializedName("INCOME") INCOME,
    @SerializedName("EXPENSE") EXPENSE
}

data class Transaction(
    val id: Long = System.currentTimeMillis(),
    val label: String,
    val amount: Double,
    val type: TransactionType,
    val category: String,
    val timestamp: Long = System.currentTimeMillis(),
    val isImportant: Boolean = false
)

data class Category(
    val name: String,
    val iconRes: Int,
    var isSelected: Boolean = false
)
