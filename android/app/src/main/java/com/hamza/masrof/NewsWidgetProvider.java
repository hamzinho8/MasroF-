package com.hamza.masrof;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;
import android.text.Html;

public class NewsWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        
        String newsHtml = prefs.getString("widget_news_html", "");
        if (newsHtml.startsWith("\"") && newsHtml.endsWith("\"")) {
            newsHtml = newsHtml.substring(1, newsHtml.length() - 1);
        }
        // Unescape JSON stringified HTML if necessary, but actually preferences plugin stringifies JSON sometimes. Let's do a simple unescape
        newsHtml = newsHtml.replace("\\\"", "\"").replace("\\n", "<br>");

        if (newsHtml.isEmpty()) {
            newsHtml = "<b>Dans ma Poche</b><br>Aucune notification.";
        }

        String balance = prefs.getString("widget_balance", "0");
        if (balance.startsWith("\"") && balance.endsWith("\"")) {
            balance = balance.substring(1, balance.length() - 1);
        }
        
        // Remove decimal part if zero or keep it, user wants simple number
        try {
            float bal = Float.parseFloat(balance);
            if (bal == (long) bal) {
                balance = String.format("%d", (long)bal);
            } else {
                balance = String.format("%.1f", bal);
            }
        } catch(Exception e) {}

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.news_widget_layout);
        
        views.setTextViewText(R.id.widget_news_text, Html.fromHtml(newsHtml, Html.FROM_HTML_MODE_COMPACT));
        views.setTextViewText(R.id.widget_news_balance, balance);
        
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

        Intent refreshIntent = new Intent(context, NewsWidgetProvider.class);
        refreshIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        refreshIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, new int[]{appWidgetId});
        PendingIntent refreshPendingIntent = PendingIntent.getBroadcast(context, appWidgetId, refreshIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_news_refresh, refreshPendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
