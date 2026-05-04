package com.hamza.masrof

import java.util.UUID

enum class TransactionType { INCOME, EXPENSE }

data class Transaction(
    val id: String = UUID.randomUUID().toString(),
    val label: String,
    val amount: Double,
    val type: TransactionType,
    val timestamp: Long = System.currentTimeMillis()
)
