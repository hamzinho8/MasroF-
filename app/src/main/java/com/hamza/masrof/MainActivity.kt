package com.hamza.masrof

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.hamza.masrof.ui.BudgetViewModel
import com.hamza.masrof.ui.theme.MasroFTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MasroFTheme {
                val viewModel: BudgetViewModel = viewModel()
                MasroFApp(viewModel = viewModel)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MasroFApp(viewModel: BudgetViewModel) {
    val items by viewModel.items.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("MasroF", fontWeight = FontWeight.Bold) }
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { showAddDialog = true }) {
                Icon(Icons.Filled.Add, contentDescription = null)
            }
        }
    ) { paddingValues ->
        Column(modifier = Modifier.padding(paddingValues)) {
            if (items.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("Appuyez sur + pour ajouter.")
                }
            } else {
                LazyColumn {
                    items(items) { item ->
                        Text(item, modifier = Modifier.padding(16.dp))
                    }
                }
            }
        }

        if (showAddDialog) {
            AlertDialog(
                onDismissRequest = { showAddDialog = false },
                confirmButton = {
                    Button(onClick = {
                        viewModel.addExpense("Nouvelle dépense")
                        showAddDialog = false
                    }) { Text("Ajouter") }
                },
                title = { Text("Ajouter") }
            )
        }
    }
