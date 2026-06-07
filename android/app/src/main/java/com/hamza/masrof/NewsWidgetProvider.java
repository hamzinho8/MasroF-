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

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.news_widget_layout);
        
        views.setTextViewText(R.id.widget_news_text, Html.fromHtml(newsHtml, Html.FROM_HTML_MODE_COMPACT));
        
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
