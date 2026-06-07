package com.hamza.masrof;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Intent;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WidgetUpdater")
public class WidgetUpdaterPlugin extends Plugin {
    @PluginMethod
    public void update(PluginCall call) {
        Intent intent = new Intent(getContext(), MasrofWidgetProvider.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        AppWidgetManager widgetManager = AppWidgetManager.getInstance(getContext());
        int[] ids = widgetManager.getAppWidgetIds(new ComponentName(getContext(), MasrofWidgetProvider.class));
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        getContext().sendBroadcast(intent);

        Intent intentNews = new Intent(getContext(), NewsWidgetProvider.class);
        intentNews.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        int[] idsNews = widgetManager.getAppWidgetIds(new ComponentName(getContext(), NewsWidgetProvider.class));
        intentNews.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, idsNews);
        getContext().sendBroadcast(intentNews);

        call.resolve();
    }
}
