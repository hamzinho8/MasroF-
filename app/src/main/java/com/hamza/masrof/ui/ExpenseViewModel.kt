package com.hamza.masrof.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.hamza.masrof.data.ExpenseDao
import com.hamza.masrof.data.ExpenseEntity
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class ExpenseViewModel(private val dao: ExpenseDao) : ViewModel() {
    val expenses: StateFlow<List<ExpenseEntity>> = dao.getAllExpenses()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun addExpense(title: String, amount: Double, category: String) {
        viewModelScope.launch {
            val expense = ExpenseEntity(
                title = title,
                amount = amount,
                date = System.currentTimeMillis(),
                category = category
            )
            dao.insertExpense(expense)
        }
    }

    fun deleteExpense(expense: ExpenseEntity) {
        viewModelScope.launch {
            dao.deleteExpense(expense)
        }
    }
}
