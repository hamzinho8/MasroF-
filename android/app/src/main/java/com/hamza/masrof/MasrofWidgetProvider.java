package com.hamza.masrof;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import android.graphics.Color;

public class MasrofWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Read preferences saved by Capacitor
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        // Capacitor wraps strings in quotes in its store or leaves them raw depending on version, let's just grab it
        String balance = prefs.getString("widget_balance", "0");
        String currency = prefs.getString("widget_currency", "DH");
        String textColorHex = prefs.getString("widget_text_color", "#FFFFFF");

        // Construct the RemoteViews object
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.masrof_widget_layout);
        
        // Clean up quotes just in case
        if (balance.startsWith("\"") && balance.endsWith("\"")) {
            balance = balance.substring(1, balance.length() - 1);
        }
        if (currency.startsWith("\"") && currency.endsWith("\"")) {
            currency = currency.substring(1, currency.length() - 1);
        }
        if (textColorHex.startsWith("\"") && textColorHex.endsWith("\"")) {
            textColorHex = textColorHex.substring(1, textColorHex.length() - 1);
        }

        views.setTextViewText(R.id.widget_balance_text, balance + " " + currency);
        
        try {
            int color = Color.parseColor(textColorHex);
            views.setTextColor(R.id.widget_balance_text, color);
        } catch (Exception e) {
            views.setTextColor(R.id.widget_balance_text, Color.WHITE);
        }

        // Instruct the widget manager to update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
