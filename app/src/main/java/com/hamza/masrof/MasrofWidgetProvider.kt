package com.hamza.masrof

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.widget.RemoteViews
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class MasrofWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
            val prefs = context.getSharedPreferences("Masrof_Expert_Prefs", Context.MODE_PRIVATE)
            val json = prefs.getString("expert_transactions", null)
            var balance = 0.0
            
            if (json != null) {
                val listType = object : TypeToken<MutableList<Transaction>>() {}.type
                val transactions: List<Transaction> = Gson().fromJson(json, listType)
                val income = transactions.filter { it.type == TransactionType.INCOME }.sumOf { it.amount }
                val expense = transactions.filter { it.type == TransactionType.EXPENSE }.sumOf { it.amount }
                balance = income - expense
            }

            val views = RemoteViews(context.packageName, R.layout.widget_masrof)
            views.setTextViewText(R.id.widgetBalance, String.format("%.2f DH", balance))

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        fun triggerUpdate(context: Context) {
            val intent = android.content.Intent(context, MasrofWidgetProvider::class.java)
            intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            val ids = AppWidgetManager.getInstance(context).getAppWidgetIds(ComponentName(context, MasrofWidgetProvider::class.java))
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
            context.sendBroadcast(intent)
        }
    }
}
