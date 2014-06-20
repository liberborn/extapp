

/* ----- /calendar/src/util/Date.js ----- */

Ext.define('Ext.calendar.util.Date', {
    
    singleton: true,
    
    diffDays: function(start, end) {
        var day = 1000 * 60 * 60 * 24,
            clear = Ext.Date.clearTime,
            diff = clear(end, true).getTime() - clear(start, true).getTime();
        
        return Math.ceil(diff / day);
    },

    copyTime: function(fromDt, toDt) {
        var dt = Ext.Date.clone(toDt);
        dt.setHours(
            fromDt.getHours(),
            fromDt.getMinutes(),
            fromDt.getSeconds(),
            fromDt.getMilliseconds());

        return dt;
    },

    compare: function(dt1, dt2, precise) {
        if (precise !== true) {
            dt1 = Ext.Date.clone(dt1);
            dt1.setMilliseconds(0);
            dt2 = Ext.Date.clone(dt2);
            dt2.setMilliseconds(0);
        }
        return dt2.getTime() - dt1.getTime();
    },
    
    isMidnight: function(dt) {
        return dt.getHours() === 0 &&
               dt.getMinutes() === 0 &&
               dt.getSeconds() === 0 && 
               dt.getMilliseconds() === 0;    
    },

    // private helper fn
    maxOrMin: function(max) {
        var dt = (max ? 0: Number.MAX_VALUE),
        i = 0,
        args = arguments[1],
        ln = args.length;
        for (; i < ln; i++) {
            dt = Math[max ? 'max': 'min'](dt, args[i].getTime());
        }
        return new Date(dt);
    },

    max: function() {
        return this.maxOrMin.apply(this, [true, arguments]);
    },

    min: function() {
        return this.maxOrMin.apply(this, [false, arguments]);
    },
    
    today: function() {
        return Ext.Date.clearTime(new Date());
    },
    
    /**
     * Adds time to the specified date and returns a new Date instance as the result (does not
     * alter the original date object). Time can be specified in any combination of milliseconds
     * to years, and the function automatically takes leap years and daylight savings into account.
     * Some syntax examples:<code><pre>
var now = new Date();

// Add 24 hours to the current date/time:
var tomorrow = Extensible.Date.add(now, { days: 1 });

// More complex, returning a date only with no time value:
var futureDate = Extensible.Date.add(now, {
    weeks: 1,
    days: 5,
    minutes: 30,
    clearTime: true
});
</pre></code>
     * @param {Date} dt The starting date to which to add time
     * @param {Object} o A config object that can contain one or more of the following
     * properties, each with an integer value:
     * 
     * - millis
     * - seconds
     * - minutes
     * - hours
     * - days
     * - weeks
     * - months
     * - years
     * 
     * You can also optionally include the property "clearTime: true" which will perform all of the
     * date addition first, then clear the time value of the final date before returning it.
     * @return {Date} A new date instance containing the resulting date/time value
     */
    add : function(dt, o) {
        if (!o) {
            return dt;
        }
        var ExtDate = Ext.Date,
            dateAdd = ExtDate.add,
            newDt = ExtDate.clone(dt);
        
        if (o.years) {
            newDt = dateAdd(newDt, ExtDate.YEAR, o.years);
        }
        if (o.months) {
            newDt = dateAdd(newDt, ExtDate.MONTH, o.months);
        }
        if (o.weeks) {
            o.days = (o.days || 0) + (o.weeks * 7);
        }
        if (o.days) {
            newDt = dateAdd(newDt, ExtDate.DAY, o.days);
        }
        if (o.hours) {
            newDt = dateAdd(newDt, ExtDate.HOUR, o.hours);
        }
        if (o.minutes) {
            newDt = dateAdd(newDt, ExtDate.MINUTE, o.minutes);
        }
        if (o.seconds) {
            newDt = dateAdd(newDt, ExtDate.SECOND, o.seconds);
        }
        if (o.millis) {
            newDt = dateAdd(newDt, ExtDate.MILLI, o.millis);
        }
         
        return o.clearTime ? ExtDate.clearTime(newDt) : newDt;
    }
});



/* ----- /calendar/src/data/EventMappings.js ----- */

//@define Ext.calendar.data.EventMappings
/**
 * @class Ext.calendar.data.EventMappings
 * A simple object that provides the field definitions for Event records so that they can
 * be easily overridden.
 *
 * To ensure the proper definition of Ext.calendar.data.EventModel the override should be
 * written like this:
 *
 *      Ext.define('MyApp.data.EventMappings', {
 *          override: 'Ext.calendar.data.EventMappings'
 *      },
 *      function () {
 *          // Update "this" (this === Ext.calendar.data.EventMappings)
 *      });
 */
Ext.ns('Ext.calendar.data');

Ext.calendar.data.EventMappings = {
    EventId: {
        name: 'EventId',
        mapping: 'id',
        type: 'int'
    },
    CalendarId: {
        name: 'CalendarId',
        mapping: 'cid',
        type: 'int'
    },
    Title: {
        name: 'Title',
        mapping: 'title',
        type: 'string'
    },
    StartDate: {
        name: 'StartDate',
        mapping: 'start',
        type: 'date',
        dateFormat: 'c'
    },
    EndDate: {
        name: 'EndDate',
        mapping: 'end',
        type: 'date',
        dateFormat: 'c'
    },
    Location: {
        name: 'Location',
        mapping: 'loc',
        type: 'string'
    },
    Notes: {
        name: 'Notes',
        mapping: 'notes',
        type: 'string'
    },
    Url: {
        name: 'Url',
        mapping: 'url',
        type: 'string'
    },
    IsAllDay: {
        name: 'IsAllDay',
        mapping: 'ad',
        type: 'boolean'
    },
    Reminder: {
        name: 'Reminder',
        mapping: 'rem',
        type: 'string'
    },
    IsNew: {
        name: 'IsNew',
        mapping: 'n',
        type: 'boolean'
    }
};




/* ----- /calendar/src/dd/StatusProxy.js ----- */

/*
 * @class Ext.calendar.dd.StatusProxy
 * A specialized drag proxy that supports a drop status icon, {@link Ext.Layer} styles and auto-repair. It also
 * contains a calendar-specific drag status message containing details about the dragged event's target drop date range.  
 * This is the default drag proxy used by all calendar views.
 * @constructor
 * @param {Object} config
 */
Ext.define('Ext.calendar.dd.StatusProxy', {
    
    extend: 'Ext.dd.StatusProxy',

    animRepair: true,
    
    /**
     * @cfg {String} moveEventCls
     * The CSS class to apply to the status element when an event is being dragged (defaults to 'ext-cal-dd-move').
     */
    moveEventCls : 'ext-cal-dd-move',
    
    /**
     * @cfg {String} addEventCls
     * The CSS class to apply to the status element when drop is not allowed (defaults to 'ext-cal-dd-add').
     */
    addEventCls : 'ext-cal-dd-add',
    
    // inherit docs
    childEls: [
        'ghost',
        'message'
    ],
    
    // inherit docs
    renderTpl: [
        '<div class="' + Ext.baseCSSPrefix + 'dd-drop-icon"></div>' +
        '<div class="ext-dd-ghost-ct">' +
            '<div id="{id}-ghost" data-ref="ghost" class="' + Ext.baseCSSPrefix + 'dd-drag-ghost"></div>' +
            '<div id="{id}-message" data-ref="message" class="' + Ext.baseCSSPrefix + 'dd-msg"></div>' +
        '</div>'
    ],

    // inherit docs
    update : function(html){
        this.callParent(arguments);
        
        var el = this.ghost.dom.firstChild;
        if(el){
            // if the ghost contains an event clone (from dragging an existing event)
            // set it to auto height to ensure visual consistency
            Ext.fly(el).setHeight('auto');
        }
    },
    
    /* @private
     * Update the calendar-specific drag status message without altering the ghost element.
     * @param {String} msg The new status message
     */
    updateMsg : function(msg){
        this.message.update(msg);
    }
});



/* ----- /calendar/src/template/BoxLayout.js ----- */

Ext.define('Ext.calendar.template.BoxLayout', {
    extend: 'Ext.XTemplate',
    
    requires: ['Ext.calendar.util.Date'],
    
    constructor: function(config){
        
        Ext.apply(this, config);
    
        var weekLinkTpl = this.showWeekLinks ? '<div id="{weekLinkId}" class="ext-cal-week-link">{weekNum}</div>' : '';
        
        this.callParent([
            '<tpl for="weeks">',
                '<div id="{[this.id]}-wk-{[xindex-1]}" class="ext-cal-wk-ct" style="top:{[this.getRowTop(xindex, xcount)]}%; height:{[this.getRowHeight(xcount)]}%;">',
                    weekLinkTpl,
                    '<table class="ext-cal-bg-tbl" cellpadding="0" cellspacing="0">',
                        '<tbody>',
                            '<tr>',
                                '<tpl for=".">',
                                     '<td id="{[this.id]}-day-{date:date("Ymd")}" class="{cellCls}">&#160;</td>',
                                '</tpl>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                    '<table class="ext-cal-evt-tbl" cellpadding="0" cellspacing="0">',
                        '<tbody>',
                            '<tr>',
                                '<tpl for=".">',
                                    '<td id="{[this.id]}-ev-day-{date:date("Ymd")}" class="{titleCls}"><div>{title}</div></td>',
                                '</tpl>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                '</div>',
            '</tpl>', {
                getRowTop: function(i, ln){
                    return ((i-1)*(100/ln));
                },
                getRowHeight: function(ln){
                    return 100/ln;
                }
            }
        ]);
    },

    applyTemplate : function(o){
        
        Ext.apply(this, o);
        
        var w = 0, title = '', first = true, isToday = false, showMonth = false, prevMonth = false, nextMonth = false,
            weeks = [[]],
            dt = Ext.Date.clone(this.viewStart),
            thisMonth = this.startDate.getMonth();
        
        for(; w < this.weekCount || this.weekCount == -1; w++){
            if(dt > this.viewEnd){
                break;
            }
            weeks[w] = [];
            
            for(var d = 0; d < this.dayCount; d++){
                isToday = dt.getTime() === Ext.calendar.util.Date.today().getTime();
                showMonth = first || (dt.getDate() == 1);
                prevMonth = (dt.getMonth() < thisMonth) && this.weekCount == -1;
                nextMonth = (dt.getMonth() > thisMonth) && this.weekCount == -1;
                
                if(dt.getDay() == 1){
                    // The ISO week format 'W' is relative to a Monday week start. If we
                    // make this check on Sunday the week number will be off.
                    weeks[w].weekNum = this.showWeekNumbers ? Ext.Date.format(dt, 'W') : '&#160;';
                    weeks[w].weekLinkId = 'ext-cal-week-'+Ext.Date.format(dt, 'Ymd');
                }
                
                if(showMonth){
                    if(isToday){
                        title = this.getTodayText();
                    }
                    else{
                        title = Ext.Date.format(dt, this.dayCount == 1 ? 'l, F j, Y' : (first ? 'M j, Y' : 'M j'));
                    }
                }
                else{
                    var dayFmt = (w == 0 && this.showHeader !== true) ? 'D j' : 'j';
                    title = isToday ? this.getTodayText() : Ext.Date.format(dt, dayFmt);
                }
                
                weeks[w].push({
                    title: title,
                    date: Ext.Date.clone(dt),
                    titleCls: 'ext-cal-dtitle ' + (isToday ? ' ext-cal-dtitle-today' : '') + 
                        (w==0 ? ' ext-cal-dtitle-first' : '') +
                        (prevMonth ? ' ext-cal-dtitle-prev' : '') + 
                        (nextMonth ? ' ext-cal-dtitle-next' : ''),
                    cellCls: 'ext-cal-day ' + (isToday ? ' ext-cal-day-today' : '') + 
                        (d==0 ? ' ext-cal-day-first' : '') +
                        (prevMonth ? ' ext-cal-day-prev' : '') +
                        (nextMonth ? ' ext-cal-day-next' : '')
                });
                dt = Ext.calendar.util.Date.add(dt, {days: 1});
                first = false;
            }
        }
        
        return this.applyOut({
            weeks: weeks
        }, []).join('');
    },
    
    getTodayText : function(){
        var dt = Ext.Date.format(new Date(), 'l, F j, Y'),
            fmt,
            todayText = this.showTodayText !== false ? this.todayText : '',
            timeText = this.showTime !== false ? ' <span id="'+this.id+'-clock" class="ext-cal-dtitle-time">' + 
                    Ext.Date.format(new Date(), 'g:i a') + '</span>' : '',
            separator = todayText.length > 0 || timeText.length > 0 ? ' &mdash; ' : '';
        
        if(this.dayCount == 1){
            return dt + separator + todayText + timeText;
        }
        fmt = this.weekCount == 1 ? 'D j' : 'j';
        return todayText.length > 0 ? todayText + timeText : Ext.Date.format(new Date(), fmt) + timeText;
    }
}, 
function() {
    this.createAlias('apply', 'applyTemplate');
});



/* ----- /calendar/src/view/AbstractCalendar.js ----- */

/**
 * @class Ext.calendar.view.AbstractCalendar
 * @extends Ext.BoxComponent
 * <p>This is an abstract class that serves as the base for other calendar views. This class is not
 * intended to be directly instantiated.</p>
 * <p>When extending this class to create a custom calendar view, you must provide an implementation
 * for the <code>renderItems</code> method, as there is no default implementation for rendering events
 * The rendering logic is totally dependent on how the UI structures its data, which
 * is determined by the underlying UI template (this base class does not have a template).</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.view.AbstractCalendar', {
    extend: 'Ext.Component',
    alias: 'widget.calendarview',
    requires: [
        'Ext.calendar.util.Date',
        'Ext.calendar.data.EventMappings'
    ],
    /**
     * @cfg {Number} startDay
     * The 0-based index for the day on which the calendar week begins (0=Sunday, which is the default)
     */
    startDay: 0,
    /**
     * @cfg {Boolean} spansHavePriority
     * Allows switching between two different modes of rendering events that span multiple days. When true,
     * span events are always sorted first, possibly at the expense of start dates being out of order (e.g., 
     * a span event that starts at 11am one day and spans into the next day would display before a non-spanning 
     * event that starts at 10am, even though they would not be in date order). This can lead to more compact
     * layouts when there are many overlapping events. If false (the default), events will always sort by start date
     * first which can result in a less compact, but chronologically consistent layout.
     */
    spansHavePriority: false,
    /**
     * @cfg {Boolean} trackMouseOver
     * Whether or not the view tracks and responds to the browser mouseover event on contained elements (defaults to
     * true). If you don't need mouseover event highlighting you can disable this.
     */
    trackMouseOver: true,
    /**
     * @cfg {Boolean} enableFx
     * Determines whether or not visual effects for CRUD actions are enabled (defaults to true). If this is false
     * it will override any values for {@link #enableAddFx}, {@link #enableUpdateFx} or {@link enableRemoveFx} and
     * all animations will be disabled.
     */
    enableFx: true,
    /**
     * @cfg {Boolean} enableAddFx
     * True to enable a visual effect on adding a new event (the default), false to disable it. Note that if 
     * {@link #enableFx} is false it will override this value. The specific effect that runs is defined in the
     * {@link #doAddFx} method.
     */
    enableAddFx: true,
    /**
     * @cfg {Boolean} enableUpdateFx
     * True to enable a visual effect on updating an event, false to disable it (the default). Note that if 
     * {@link #enableFx} is false it will override this value. The specific effect that runs is defined in the
     * {@link #doUpdateFx} method.
     */
    enableUpdateFx: false,
    /**
     * @cfg {Boolean} enableRemoveFx
     * True to enable a visual effect on removing an event (the default), false to disable it. Note that if 
     * {@link #enableFx} is false it will override this value. The specific effect that runs is defined in the
     * {@link #doRemoveFx} method.
     */
    enableRemoveFx: true,
    /**
     * @cfg {Boolean} enableDD
     * True to enable drag and drop in the calendar view (the default), false to disable it
     */
    enableDD: true,
    /**
     * @cfg {Boolean} monitorResize
     * True to monitor the browser's resize event (the default), false to ignore it. If the calendar view is rendered
     * into a fixed-size container this can be set to false. However, if the view can change dimensions (e.g., it's in 
     * fit layout in a viewport or some other resizable container) it is very important that this config is true so that
     * any resize event propagates properly to all subcomponents and layouts get recalculated properly.
     */
    monitorResize: true,
    /**
     * @cfg {String} ddCreateEventText
     * The text to display inside the drag proxy while dragging over the calendar to create a new event (defaults to 
     * 'Create event for {0}' where {0} is a date range supplied by the view)
     */
    ddCreateEventText: 'Create event for {0}',
    /**
     * @cfg {String} ddMoveEventText
     * The text to display inside the drag proxy while dragging an event to reposition it (defaults to 
     * 'Move event to {0}' where {0} is the updated event start date/time supplied by the view)
     */
    ddMoveEventText: 'Move event to {0}',
    /**
     * @cfg {String} ddResizeEventText
     * The string displayed to the user in the drag proxy while dragging the resize handle of an event (defaults to 
     * 'Update event to {0}' where {0} is the updated event start-end range supplied by the view). Note that 
     * this text is only used in views
     * that allow resizing of events.
     */
    ddResizeEventText: 'Update event to {0}',

    //private properties -- do not override:
    weekCount: 1,
    dayCount: 1,
    eventSelector: '.ext-cal-evt',
    eventOverClass: 'ext-evt-over',
    eventElIdDelimiter: '-evt-',
    dayElIdDelimiter: '-day-',

    /**
     * Returns a string of HTML template markup to be used as the body portion of the event template created
     * by {@link #getEventTemplate}. This provdes the flexibility to customize what's in the body without
     * having to override the entire XTemplate. This string can include any valid {@link Ext.Template} code, and
     * any data tokens accessible to the containing event template can be referenced in this string.
     * @return {String} The body template string
     */
    getEventBodyMarkup: Ext.emptyFn,
    // must be implemented by a subclass
    /**
     * <p>Returns the XTemplate that is bound to the calendar's event store (it expects records of type
     * {@link Ext.calendar.EventRecord}) to populate the calendar views with events. Internally this method
     * by default generates different markup for browsers that support CSS border radius and those that don't.
     * This method can be overridden as needed to customize the markup generated.</p>
     * <p>Note that this method calls {@link #getEventBodyMarkup} to retrieve the body markup for events separately
     * from the surrounding container markup.  This provdes the flexibility to customize what's in the body without
     * having to override the entire XTemplate. If you do override this method, you should make sure that your 
     * overridden version also does the same.</p>
     * @return {Ext.XTemplate} The event XTemplate
     */
    getEventTemplate: Ext.emptyFn,

    /**
     * @event eventsrendered
     * Fires after events are finished rendering in the view
     * @param {Ext.calendar.view.AbstractCalendar} this 
     */

    /**
     * @event eventclick
     * Fires after the user clicks on an event element
     * @param {Ext.calendar.view.AbstractCalendar} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that was clicked on
     * @param {HTMLNode} el The DOM node that was clicked on
     */

    /**
     * @event eventover
     * Fires anytime the mouse is over an event element
     * @param {Ext.calendar.view.AbstractCalendar} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that the cursor is over
     * @param {HTMLNode} el The DOM node that is being moused over
     */

    /**
     * @event eventout
     * Fires anytime the mouse exits an event element
     * @param {Ext.calendar.view.AbstractCalendar} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that the cursor exited
     * @param {HTMLNode} el The DOM node that was exited
     */

    /**
     * @event datechange
     * Fires after the start date of the view changes
     * @param {Ext.calendar.view.AbstractCalendar} this
     * @param {Date} startDate The start date of the view (as explained in {@link #getStartDate}
     * @param {Date} viewStart The first displayed date in the view
     * @param {Date} viewEnd The last displayed date in the view
     */

    /**
     * @event rangeselect
     * Fires after the user drags on the calendar to select a range of dates/times in which to create an event
     * @param {Ext.calendar.view.AbstractCalendar} this
     * @param {Object} dates An object containing the start (StartDate property) and end (EndDate property) dates selected
     * @param {Function} callback A callback function that MUST be called after the event handling is complete so that
     * the view is properly cleaned up (shim elements are persisted in the view while the user is prompted to handle the
     * range selection). The callback is already created in the proper scope, so it simply needs to be executed as a standard
     * function call (e.g., callback()).
     */

    /**
     * @event eventmove
     * Fires after an event element is dragged by the user and dropped in a new position
     * @param {Ext.calendar.view.AbstractCalendar} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that was moved with
     * updated start and end dates
     */

    /**
     * @event initdrag
     * Fires when a drag operation is initiated in the view
     * @param {Ext.calendar.view.AbstractCalendar} this
     */

    /**
     * @event dayover
     * Fires while the mouse is over a day element 
     * @param {Ext.calendar.view.AbstractCalendar} this
     * @param {Date} dt The date that is being moused over
     * @param {Ext.core.Element} el The day Element that is being moused over
     */

    /**
     * @event dayout
     * Fires when the mouse exits a day element 
     * @param {Ext.calendar.view.AbstractCalendar} this
     * @param {Date} dt The date that is exited
     * @param {Ext.core.Element} el The day Element that is exited
     */

    /*
     * @event eventdelete
     * Fires after an event element is deleted by the user. Not currently implemented directly at the view level -- currently 
     * deletes only happen from one of the forms.
     * @param {Ext.calendar.view.AbstractCalendar} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that was deleted
     */

    // must be implemented by a subclass
    // private
    initComponent: function() {
        this.setStartDate(this.startDate || new Date());

        this.callParent(arguments);
    },

    // private
    afterRender: function() {
        this.callParent(arguments);

        this.renderTemplate();

        if (this.store) {
            this.setStore(this.store, true);
        }

        this.el.on({
            'mouseover': this.onMouseOver,
            'mouseout': this.onMouseOut,
            'click': this.onClick,
            scope: this
        });

        this.el.unselectable();

        if (this.enableDD && this.initDD) {
            this.initDD();
        }

        this.on('eventsrendered', this.forceSize);
        Ext.defer(this.forceSize, 100, this);

    },

    // private
    forceSize: function() {
        if (this.el && this.el.down) {
            var hd = this.el.down('.ext-cal-hd-ct'),
                bd = this.el.down('.ext-cal-body-ct');
                
            if (bd==null || hd==null) {
                return;
            }
                
            var headerHeight = hd.getHeight(),
                sz = this.el.parent().getSize();
                   
            bd.setHeight(sz.height-headerHeight);
        }
    },

    refresh: function() {
        this.prepareData();
        this.renderTemplate();
        this.renderItems();
    },

    getWeekCount: function() {
        var days = Ext.calendar.util.Date.diffDays(this.viewStart, this.viewEnd);
        return Math.ceil(days / this.dayCount);
    },

    // private
    prepareData: function() {
        var lastInMonth = Ext.Date.getLastDateOfMonth(this.startDate),
            w = 0, d,
            dt = Ext.Date.clone(this.viewStart),
            weeks = this.weekCount < 1 ? 6: this.weekCount;

        this.eventGrid = [[]];
        this.allDayGrid = [[]];
        this.evtMaxCount = [];
        
        var evtsInView = this.store.queryBy(function(rec) {
            return this.isEventVisible(rec.data);
        },
        this);

        for (; w < weeks; w++) {
            this.evtMaxCount[w] = 0;
            if (this.weekCount == -1 && dt > lastInMonth) {
                //current week is fully in next month so skip
                break;
            }
            this.eventGrid[w] = this.eventGrid[w] || [];
            this.allDayGrid[w] = this.allDayGrid[w] || [];

            for (d = 0; d < this.dayCount; d++) {
                if (evtsInView.getCount() > 0) {
                    var evts = evtsInView.filterBy(function(rec) {
                        var startDt = Ext.Date.clearTime(rec.data[Ext.calendar.data.EventMappings.StartDate.name], true),
                            startsOnDate = dt.getTime() == startDt.getTime(),
                            spansFromPrevView = (w == 0 && d == 0 && (dt > rec.data[Ext.calendar.data.EventMappings.StartDate.name]));
                            
                        return startsOnDate || spansFromPrevView;
                    },
                    this);

                    this.sortEventRecordsForDay(evts);
                    this.prepareEventGrid(evts, w, d);
                }
                dt = Ext.calendar.util.Date.add(dt, {days: 1});
            }
        }
        this.currentWeekCount = w;
    },

    // private
    prepareEventGrid: function(evts, w, d) {
        var me = this,
            row = 0,
            max = me.maxEventsPerDay ? me.maxEventsPerDay: 999;

        evts.each(function(evt) {
            var M = Ext.calendar.data.EventMappings,
            days = Ext.calendar.util.Date.diffDays(
            Ext.calendar.util.Date.max(me.viewStart, evt.data[M.StartDate.name]),
            Ext.calendar.util.Date.min(me.viewEnd, evt.data[M.EndDate.name])) + 1;

            if (days > 1 || Ext.calendar.util.Date.diffDays(evt.data[M.StartDate.name], evt.data[M.EndDate.name]) > 1) {
                me.prepareEventGridSpans(evt, me.eventGrid, w, d, days);
                me.prepareEventGridSpans(evt, me.allDayGrid, w, d, days, true);
            } else {
                row = me.findEmptyRowIndex(w, d);
                me.eventGrid[w][d] = me.eventGrid[w][d] || [];
                me.eventGrid[w][d][row] = evt;

                if (evt.data[M.IsAllDay.name]) {
                    row = me.findEmptyRowIndex(w, d, true);
                    me.allDayGrid[w][d] = me.allDayGrid[w][d] || [];
                    me.allDayGrid[w][d][row] = evt;
                }
            }

            if (me.evtMaxCount[w] < me.eventGrid[w][d].length) {
                me.evtMaxCount[w] = Math.min(max + 1, me.eventGrid[w][d].length);
            }
            return true;
        });
    },

    // private
    prepareEventGridSpans: function(evt, grid, w, d, days, allday) {
        // this event spans multiple days/weeks, so we have to preprocess
        // the events and store special span events as placeholders so that
        // the render routine can build the necessary TD spans correctly.
        var w1 = w,
        d1 = d,
        row = this.findEmptyRowIndex(w, d, allday),
        dt = Ext.Date.clone(this.viewStart);

        var start = {
            event: evt,
            isSpan: true,
            isSpanStart: true,
            spanLeft: false,
            spanRight: (d == 6)
        };
        grid[w][d] = grid[w][d] || [];
        grid[w][d][row] = start;

        while (--days) {
            dt = Ext.calendar.util.Date.add(dt, {days: 1});
            if (dt > this.viewEnd) {
                break;
            }
            if (++d1 > 6) {
                // reset counters to the next week
                d1 = 0;
                w1++;
                row = this.findEmptyRowIndex(w1, 0);
            }
            grid[w1] = grid[w1] || [];
            grid[w1][d1] = grid[w1][d1] || [];

            grid[w1][d1][row] = {
                event: evt,
                isSpan: true,
                isSpanStart: (d1 == 0),
                spanLeft: (w1 > w) && (d1 % 7 == 0),
                spanRight: (d1 == 6) && (days > 1)
            };
        }
    },

    // private
    findEmptyRowIndex: function(w, d, allday) {
        var grid = allday ? this.allDayGrid: this.eventGrid,
        day = grid[w] ? grid[w][d] || [] : [],
        i = 0,
        ln = day.length;

        for (; i < ln; i++) {
            if (day[i] == null) {
                return i;
            }
        }
        return ln;
    },

    // private
    renderTemplate: function() {
        if (this.tpl) {
            this.el.select('*').destroy();
            this.tpl.overwrite(this.el, this.getParams());
            this.lastRenderStart = Ext.Date.clone(this.viewStart);
            this.lastRenderEnd = Ext.Date.clone(this.viewEnd);
        }
    },

    disableStoreEvents: function() {
        this.monitorStoreEvents = false;
    },

    enableStoreEvents: function(refresh) {
        this.monitorStoreEvents = true;
        if (refresh === true) {
            this.refresh();
        }
    },

    // private
    onResize: function() {
        this.callParent(arguments);
        this.refresh();
    },

    // private
    onInitDrag: function() {
        this.fireEvent('initdrag', this);
    },

    // private
    onEventDrop: function(rec, dt) {
        if (Ext.calendar.util.Date.compare(rec.data[Ext.calendar.data.EventMappings.StartDate.name], dt) === 0) {
            // no changes
            return;
        }
        var diff = dt.getTime() - rec.data[Ext.calendar.data.EventMappings.StartDate.name].getTime();
        rec.set(Ext.calendar.data.EventMappings.StartDate.name, dt);
        rec.set(Ext.calendar.data.EventMappings.EndDate.name, Ext.calendar.util.Date.add(rec.data[Ext.calendar.data.EventMappings.EndDate.name], {millis: diff}));

        this.fireEvent('eventmove', this, rec);
    },

    // private
    onCalendarEndDrag: function(start, end, onComplete) {
        if (start && end) {
            // set this flag for other event handlers that might conflict while we're waiting
            this.dragPending = true;

            // have to wait for the user to save or cancel before finalizing the dd interation
            var o = {};
            o[Ext.calendar.data.EventMappings.StartDate.name] = start;
            o[Ext.calendar.data.EventMappings.EndDate.name] = end;

            this.fireEvent('rangeselect', this, o, Ext.bind(this.onCalendarEndDragComplete, this, [onComplete]));
        }
    },

    // private
    onCalendarEndDragComplete: function(onComplete) {
        // callback for the drop zone to clean up
        onComplete();
        // clear flag for other events to resume normally
        this.dragPending = false;
    },

    // private
    onUpdate: function(ds, rec, operation) {
        if (this.monitorStoreEvents === false) {
            return;
        }
        if (operation == Ext.data.Record.COMMIT) {
            this.refresh();
            if (this.enableFx && this.enableUpdateFx) {
                this.doUpdateFx(this.getEventEls(rec.data[Ext.calendar.data.EventMappings.EventId.name]), {
                    scope: this
                });
            }
        }
    },


    doUpdateFx: function(els, o) {
        this.highlightEvent(els, null, o);
    },

    // private
    onAdd: function(ds, records, index) {
        if (this.monitorStoreEvents === false) {
            return;
        }
        var rec = records[0];
        this.tempEventId = rec.id;
        this.refresh();

        if (this.enableFx && this.enableAddFx) {
            this.doAddFx(this.getEventEls(rec.data[Ext.calendar.data.EventMappings.EventId.name]), {
                scope: this
            });
        }
    },

    doAddFx: function(els, o) {
        els.fadeIn(Ext.apply(o, {
            duration: 2000
        }));
    },

    // private
    onRemove: function(ds, recs) {
        var name = Ext.calendar.data.EventMappings.EventId.name,
            i, len, rec, els;
        
        if (this.monitorStoreEvents === false) {
            return;
        }
        
        for (i = 0, len = recs.length; i < len; i++) {
            rec = recs[i];
            
            if (this.enableFx && this.enableRemoveFx) {
                els = this.getEventEls(rec.get(name));
                
                if (els.getCount() > 0) {
                    this.doRemoveFx(els, {
                        remove: true,
                        scope: this,
                        callback: this.refresh
                    });
                }
            }
            else {
                this.getEventEls(rec.get(name)).remove();
                this.refresh();
            }
        }
    },

    doRemoveFx: function(els, o) {
        els.fadeOut(o);
    },

    /**
     * Visually highlights an event using {@link Ext.Fx#highlight} config options.
     * If {@link #highlightEventActions} is false this method will have no effect.
     * @param {Ext.CompositeElement} els The element(s) to highlight
     * @param {Object} color (optional) The highlight color. Should be a 6 char hex 
     * color without the leading # (defaults to yellow: 'ffff9c')
     * @param {Object} o (optional) Object literal with any of the {@link Ext.Fx} config 
     * options. See {@link Ext.Fx#highlight} for usage examples.
     */
    highlightEvent: function(els, color, o) {
        if (this.enableFx) {
            var c;
            ! (Ext.isIE || Ext.isOpera) ?
            els.highlight(color, o) :
            // Fun IE/Opera handling:
            els.each(function(el) {
                el.highlight(color, Ext.applyIf({
                    attr: 'color'
                },
                o));
                c = el.down('.ext-cal-evm');
                if (c) {
                    c.highlight(color, o);
                }
            },
            this);
        }
    },

    /**
     * Retrieve an Event object's id from its corresponding node in the DOM.
     * @param {String/Element/HTMLElement} el An {@link Ext.core.Element}, DOM node or id
     */
    getEventIdFromEl: function(el) {
        el = Ext.get(el);
        var id = el.id.split(this.eventElIdDelimiter)[1],
            lastHypen = id.lastIndexOf('-');

        // MUST look for last hyphen because autogenned record IDs can contain hyphens
        if (lastHypen > -1) {
            //This id has the index of the week it is rendered in as the suffix.
            //This allows events that span across weeks to still have reproducibly-unique DOM ids.
            id = id.substr(0, lastHypen);
        }
        return id;
    },

    // private
    getEventId: function(eventId) {
        if (eventId === undefined && this.tempEventId) {
            eventId = this.tempEventId;
        }
        return eventId;
    },

    /**
     * 
     * @param {String} eventId
     * @param {Boolean} forSelect
     * @return {String} The selector class
     */
    getEventSelectorCls: function(eventId, forSelect) {
        var prefix = forSelect ? '.': '';
        return prefix + this.id + this.eventElIdDelimiter + this.getEventId(eventId);
    },

    /**
     * 
     * @param {String} eventId
     * @return {Ext.CompositeElement} The matching CompositeElement of nodes
     * that comprise the rendered event.  Any event that spans across a view 
     * boundary will contain more than one internal Element.
     */
    getEventEls: function(eventId) {
        var els = Ext.select(this.getEventSelectorCls(this.getEventId(eventId), true), false, this.el.dom);
        return new Ext.CompositeElement(els);
    },

    /**
     * Returns true if the view is currently displaying today's date, else false.
     * @return {Boolean} True or false
     */
    isToday: function() {
        var today = Ext.Date.clearTime(new Date()).getTime();
        return this.viewStart.getTime() <= today && this.viewEnd.getTime() >= today;
    },

    // private
    onDataChanged: function(store) {
        this.refresh();
    },

    // private
    isEventVisible: function(evt) {
        var M = Ext.calendar.data.EventMappings,
            data = evt.data || evt,
            start = this.viewStart.getTime(),
            end = this.viewEnd.getTime(),
            evStart = data[M.StartDate.name].getTime(),
            evEnd = data[M.EndDate.name].getTime();
            evEnd = Ext.calendar.util.Date.add(data[M.EndDate.name], {seconds: -1}).getTime();

        return this.rangesOverlap(start, end, evStart, evEnd);
    },
    
    rangesOverlap: function(start1, end1, start2, end2) {
        var startsInRange = (start1 >= start2 && start1 <= end2),
            endsInRange = (end1 >= start2 && end1 <= end2),
            spansRange = (start1 <= start2 && end1 >= end2);
            
        return (startsInRange || endsInRange || spansRange);
    },

    // private
    isOverlapping: function(evt1, evt2) {
        var ev1 = evt1.data ? evt1.data: evt1,
        ev2 = evt2.data ? evt2.data: evt2,
        M = Ext.calendar.data.EventMappings,
        start1 = ev1[M.StartDate.name].getTime(),
        end1 = Ext.calendar.util.Date.add(ev1[M.EndDate.name], {seconds: -1}).getTime(),
        start2 = ev2[M.StartDate.name].getTime(),
        end2 = Ext.calendar.util.Date.add(ev2[M.EndDate.name], {seconds: -1}).getTime();

        if (end1 < start1) {
            end1 = start1;
        }
        if (end2 < start2) {
            end2 = start2;
        }

        return (start1 <= end2 && end1 >= start2);
    },

    getDayEl: function(dt) {
        return Ext.get(this.getDayId(dt));
    },

    getDayId: function(dt) {
        if (Ext.isDate(dt)) {
            dt = Ext.Date.format(dt, 'Ymd');
        }
        return this.id + this.dayElIdDelimiter + dt;
    },

    /**
     * Returns the start date of the view, as set by {@link #setStartDate}. Note that this may not 
     * be the first date displayed in the rendered calendar -- to get the start and end dates displayed
     * to the user use {@link #getViewBounds}.
     * @return {Date} The start date
     */
    getStartDate: function() {
        return this.startDate;
    },

    /**
     * Sets the start date used to calculate the view boundaries to display. The displayed view will be the 
     * earliest and latest dates that match the view requirements and contain the date passed to this function.
     * @param {Date} dt The date used to calculate the new view boundaries
     */
    setStartDate: function(start, refresh) {
        this.startDate = Ext.Date.clearTime(start);
        this.setViewBounds(start);
        this.store.load({
            params: {
                start: Ext.Date.format(this.viewStart, 'm-d-Y'),
                end: Ext.Date.format(this.viewEnd, 'm-d-Y')
            }
        });
        if (refresh === true) {
            this.refresh();
        }
        this.fireEvent('datechange', this, this.startDate, this.viewStart, this.viewEnd);
    },

    // private
    setViewBounds: function(startDate) {
        var start = startDate || this.startDate,
            offset = start.getDay() - this.startDay,
            Dt = Ext.calendar.util.Date;

        switch (this.weekCount) {
        case 0:
        case 1:
            this.viewStart = this.dayCount < 7 ? start: Dt.add(start, {days: -offset, clearTime: true});
            this.viewEnd = Dt.add(this.viewStart, {days: this.dayCount || 7});
            this.viewEnd = Dt.add(this.viewEnd, {seconds: -1});
            return;

        case - 1:
            // auto by month
            start = Ext.Date.getFirstDateOfMonth(start);
            offset = start.getDay() - this.startDay;

            this.viewStart = Dt.add(start, {days: -offset, clearTime: true});

            // start from current month start, not view start:
            var end = Dt.add(start, {months: 1, seconds: -1});
            // fill out to the end of the week:
            this.viewEnd = Dt.add(end, {days: 6 - end.getDay()});
            return;

        default:
            this.viewStart = Dt.add(start, {days: -offset, clearTime: true});
            this.viewEnd = Dt.add(this.viewStart, {days: this.weekCount * 7, seconds: -1});
        }
    },

    // private
    getViewBounds: function() {
        return {
            start: this.viewStart,
            end: this.viewEnd
        };
    },

    /* private
     * Sort events for a single day for display in the calendar.  This sorts allday
     * events first, then non-allday events are sorted either based on event start
     * priority or span priority based on the value of {@link #spansHavePriority} 
     * (defaults to event start priority).
     * @param {MixedCollection} evts A {@link Ext.util.MixedCollection MixedCollection}  
     * of {@link #Ext.calendar.EventRecord EventRecord} objects
     */
    sortEventRecordsForDay: function(evts) {
        if (evts.length < 2) {
            return;
        }
        evts.sortBy(Ext.bind(function(evtA, evtB) {
            var a = evtA.data,
            b = evtB.data,
            M = Ext.calendar.data.EventMappings;

            // Always sort all day events before anything else
            if (a[M.IsAllDay.name]) {
                return - 1;
            }
            else if (b[M.IsAllDay.name]) {
                return 1;
            }
            if (this.spansHavePriority) {
                // This logic always weights span events higher than non-span events
                // (at the possible expense of start time order). This seems to
                // be the approach used by Google calendar and can lead to a more
                // visually appealing layout in complex cases, but event order is
                // not guaranteed to be consistent.
                var diff = Ext.calendar.util.Date.diffDays;
                if (diff(a[M.StartDate.name], a[M.EndDate.name]) > 0) {
                    if (diff(b[M.StartDate.name], b[M.EndDate.name]) > 0) {
                        // Both events are multi-day
                        if (a[M.StartDate.name].getTime() == b[M.StartDate.name].getTime()) {
                            // If both events start at the same time, sort the one
                            // that ends later (potentially longer span bar) first
                            return b[M.EndDate.name].getTime() - a[M.EndDate.name].getTime();
                        }
                        return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
                    }
                    return - 1;
                }
                else if (diff(b[M.StartDate.name], b[M.EndDate.name]) > 0) {
                    return 1;
                }
                return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
            }
            else {
                // Doing this allows span and non-span events to intermingle but
                // remain sorted sequentially by start time. This seems more proper
                // but can make for a less visually-compact layout when there are
                // many such events mixed together closely on the calendar.
                return a[M.StartDate.name].getTime() - b[M.StartDate.name].getTime();
            }
        }, this));
    },

    /**
     * Updates the view to contain the passed date
     * @param {Date} dt The date to display
     * @return {Date} The new view start date
     */
    moveTo: function(dt, noRefresh) {
        if (Ext.isDate(dt)) {
            this.setStartDate(dt);
            if (noRefresh !== false) {
                this.refresh();
            }
            return this.startDate;
        }
        return dt;
    },

    /**
     * Updates the view to the next consecutive date(s)
     * @return {Date} The new view start date
     */
    moveNext: function(noRefresh) {
        return this.moveTo(Ext.calendar.util.Date.add(this.viewEnd, {days: 1}));
    },

    /**
     * Updates the view to the previous consecutive date(s)
     * @return {Date} The new view start date
     */
    movePrev: function(noRefresh) {
        var days = Ext.calendar.util.Date.diffDays(this.viewStart, this.viewEnd) + 1;
        return this.moveDays( - days, noRefresh);
    },

    /**
     * Shifts the view by the passed number of months relative to the currently set date
     * @param {Number} value The number of months (positive or negative) by which to shift the view
     * @return {Date} The new view start date
     */
    moveMonths: function(value, noRefresh) {
        return this.moveTo(Ext.calendar.util.Date.add(this.startDate, {months: value}), noRefresh);
    },

    /**
     * Shifts the view by the passed number of weeks relative to the currently set date
     * @param {Number} value The number of weeks (positive or negative) by which to shift the view
     * @return {Date} The new view start date
     */
    moveWeeks: function(value, noRefresh) {
        return this.moveTo(Ext.calendar.util.Date.add(this.startDate, {days: value * 7}), noRefresh);
    },

    /**
     * Shifts the view by the passed number of days relative to the currently set date
     * @param {Number} value The number of days (positive or negative) by which to shift the view
     * @return {Date} The new view start date
     */
    moveDays: function(value, noRefresh) {
        return this.moveTo(Ext.calendar.util.Date.add(this.startDate, {days: value}), noRefresh);
    },

    /**
     * Updates the view to show today
     * @return {Date} Today's date
     */
    moveToday: function(noRefresh) {
        return this.moveTo(new Date(), noRefresh);
    },

    /**
     * Sets the event store used by the calendar to display {@link Ext.calendar.EventRecord events}.
     * @param {Ext.data.Store} store
     */
    setStore: function(store, initial) {
        if (!initial && this.store) {
            this.store.un("datachanged", this.onDataChanged, this);
            this.store.un("add", this.onAdd, this);
            this.store.un("remove", this.onRemove, this);
            this.store.un("update", this.onUpdate, this);
            this.store.un("clear", this.refresh, this);
        }
        if (store) {
            store.on("datachanged", this.onDataChanged, this);
            store.on("add", this.onAdd, this);
            store.on("remove", this.onRemove, this);
            store.on("update", this.onUpdate, this);
            store.on("clear", this.refresh, this);
        }
        this.store = store;
        if (store && store.getCount() > 0) {
            this.refresh();
        }
    },

    getEventRecord: function(id) {
        var idx = this.store.find(Ext.calendar.data.EventMappings.EventId.name, id);
        return this.store.getAt(idx);
    },

    getEventRecordFromEl: function(el) {
        return this.getEventRecord(this.getEventIdFromEl(el));
    },

    // private
    getParams: function() {
        return {
            viewStart: this.viewStart,
            viewEnd: this.viewEnd,
            startDate: this.startDate,
            dayCount: this.dayCount,
            weekCount: this.weekCount,
            title: this.getTitle()
        };
    },

    getTitle: function() {
        return Ext.Date.format(this.startDate, 'F Y');
    },

    /*
     * Shared click handling.  Each specific view also provides view-specific
     * click handling that calls this first.  This method returns true if it
     * can handle the click (and so the subclass should ignore it) else false.
     */
    onClick: function(e, t) {
        var el = e.getTarget(this.eventSelector, 5);
        if (el) {
            var id = this.getEventIdFromEl(el);
            this.fireEvent('eventclick', this, this.getEventRecord(id), el);
            return true;
        }
    },

    // private
    onMouseOver: function(e, t) {
        if (this.trackMouseOver !== false && (this.dragZone == undefined || !this.dragZone.dragging)) {
            if (!this.handleEventMouseEvent(e, t, 'over')) {
                this.handleDayMouseEvent(e, t, 'over');
            }
        }
    },

    // private
    onMouseOut: function(e, t) {
        if (this.trackMouseOver !== false && (this.dragZone == undefined || !this.dragZone.dragging)) {
            if (!this.handleEventMouseEvent(e, t, 'out')) {
                this.handleDayMouseEvent(e, t, 'out');
            }
        }
    },

    // private
    handleEventMouseEvent: function(e, t, type) {
        var el = e.getTarget(this.eventSelector, 5, true),
            rel,
            els,
            evtId;
        if (el) {
            rel = Ext.get(e.getRelatedTarget());
            if (el == rel || el.contains(rel)) {
                return true;
            }

            evtId = this.getEventIdFromEl(el);

            if (this.eventOverClass) {
                els = this.getEventEls(evtId);
                els[type == 'over' ? 'addCls': 'removeCls'](this.eventOverClass);
            }
            this.fireEvent('event' + type, this, this.getEventRecord(evtId), el);
            return true;
        }
        return false;
    },

    // private
    getDateFromId: function(id, delim) {
        var parts = id.split(delim);
        return parts[parts.length - 1];
    },

    // private
    handleDayMouseEvent: function(e, t, type) {
        t = e.getTarget('td', 3);
        if (t) {
            if (t.id && t.id.indexOf(this.dayElIdDelimiter) > -1) {
                var dt = this.getDateFromId(t.id, this.dayElIdDelimiter),
                rel = Ext.get(e.getRelatedTarget()),
                relTD,
                relDate;

                if (rel) {
                    relTD = rel.is('td') ? rel: rel.up('td', 3);
                    relDate = relTD && relTD.id ? this.getDateFromId(relTD.id, this.dayElIdDelimiter) : '';
                }
                if (!rel || dt != relDate) {
                    var el = this.getDayEl(dt);
                    if (el && this.dayOverClass != '') {
                        el[type == 'over' ? 'addCls': 'removeCls'](this.dayOverClass);
                    }
                    this.fireEvent('day' + type, this, Ext.Date.parseDate(dt, "Ymd"), el);
                }
            }
        }
    },

    // private
    renderItems: function() {
        throw 'This method must be implemented by a subclass';
    },
    
    // private
    destroy: function(){
        this.callParent(arguments);
        
        if(this.el){
            this.el.un('contextmenu', this.onContextMenu, this);
        }
        Ext.destroy(
            this.editWin, 
            this.eventMenu,
            this.dragZone,
            this.dropZone
        );
    }
});



/* ----- /calendar/src/dd/DragZone.js ----- */

/*
 * Internal drag zone implementation for the calendar components. This provides base functionality
 * and is primarily for the month view -- DayViewDD adds day/week view-specific functionality.
 */
Ext.define('Ext.calendar.dd.DragZone', {
    extend: 'Ext.dd.DragZone',

    requires: [
        'Ext.calendar.dd.StatusProxy',
        'Ext.calendar.data.EventMappings'
    ],
    
    ddGroup: 'CalendarDD',
    eventSelector: '.ext-cal-evt',

    constructor: function(el, config) {
        if (!Ext.calendar._statusProxyInstance) {
            Ext.calendar._statusProxyInstance = new Ext.calendar.dd.StatusProxy();
        }
        this.proxy = Ext.calendar._statusProxyInstance;
        this.callParent(arguments);
    },

    getDragData: function(e) {
        // Check whether we are dragging on an event first
        var t = e.getTarget(this.eventSelector, 3);
        if (t) {
            var rec = this.view.getEventRecordFromEl(t);
            return {
                type: 'eventdrag',
                ddel: t,
                eventStart: rec.data[Ext.calendar.data.EventMappings.StartDate.name],
                eventEnd: rec.data[Ext.calendar.data.EventMappings.EndDate.name],
                proxy: this.proxy
            };
        }

        // If not dragging an event then we are dragging on
        // the calendar to add a new event
        t = this.view.getDayAt(e.getX(), e.getY());
        if (t.el) {
            return {
                type: 'caldrag',
                start: t.date,
                proxy: this.proxy
            };
        }
        return null;
    },

    onInitDrag: function(x, y) {
        if (this.dragData.ddel) {
            var ghost = this.dragData.ddel.cloneNode(true),
            child = Ext.fly(ghost).down('dl');

            Ext.fly(ghost).setWidth('auto');

            if (child) {
                // for IE/Opera
                child.setHeight('auto');
            }
            this.proxy.update(ghost);
            this.onStartDrag(x, y);
        }
        else if (this.dragData.start) {
            this.onStartDrag(x, y);
        }
        this.view.onInitDrag();
        return true;
    },

    afterRepair: function() {
        if (Ext.enableFx && this.dragData.ddel) {
            Ext.fly(this.dragData.ddel).highlight(this.hlColor || 'c3daf9');
        }
        this.dragging = false;
    },

    getRepairXY: function(e) {
        if (this.dragData.ddel) {
            return Ext.fly(this.dragData.ddel).getXY();
        }
    },

    afterInvalidDrop: function(e, id) {
        Ext.select('.ext-dd-shim').hide();
    }
});



/* ----- /calendar/src/dd/DropZone.js ----- */

/*
 * Internal drop zone implementation for the calendar components. This provides base functionality
 * and is primarily for the month view -- DayViewDD adds day/week view-specific functionality.
 */
Ext.define('Ext.calendar.dd.DropZone', {
    extend: 'Ext.dd.DropZone',
    
    requires: [
        'Ext.calendar.util.Date',
        'Ext.calendar.data.EventMappings'
    ],

    ddGroup: 'CalendarDD',
    eventSelector: '.ext-cal-evt',

    // private
    shims: [],

    getTargetFromEvent: function(e) {
        var dragOffset = this.dragOffset || 0,
        y = e.getY() - dragOffset,
        d = this.view.getDayAt(e.getX(), y);

        return d.el ? d: null;
    },

    onNodeOver: function(n, dd, e, data) {
        var D = Ext.calendar.util.Date,
        start = data.type == 'eventdrag' ? n.date: D.min(data.start, n.date),
        end = data.type == 'eventdrag' ? D.add(n.date, {days: D.diffDays(data.eventStart, data.eventEnd)}) :
        D.max(data.start, n.date);

        if (!this.dragStartDate || !this.dragEndDate || (D.diffDays(start, this.dragStartDate) != 0) || (D.diffDays(end, this.dragEndDate) != 0)) {
            this.dragStartDate = start;
            this.dragEndDate = D.add(end, {days: 1, millis: -1, clearTime: true});
            this.shim(start, end);

            var range = Ext.Date.format(start, 'n/j');
            if (D.diffDays(start, end) > 0) {
                range += '-' + Ext.Date.format(end, 'n/j');
            }
            var msg = Ext.util.Format.format(data.type == 'eventdrag' ? this.moveText: this.createText, range);
            data.proxy.updateMsg(msg);
        }
        return this.dropAllowed;
    },

    shim: function(start, end) {
        this.currWeek = -1;
        this.DDMInstance.notifyOccluded = true;
        var dt = Ext.Date.clone(start),
            i = 0,
            shim,
            box,
            D = Ext.calendar.util.Date,
            cnt = D.diffDays(dt, end) + 1;

        Ext.each(this.shims,
            function(shim) {
                if (shim) {
                    shim.isActive = false;
                }
            }
        );

        while (i++<cnt) {
            var dayEl = this.view.getDayEl(dt);

            // if the date is not in the current view ignore it (this
            // can happen when an event is dragged to the end of the
            // month so that it ends outside the view)
            if (dayEl) {
                var wk = this.view.getWeekIndex(dt);
                shim = this.shims[wk];

                if (!shim) {
                    shim = this.createShim();
                    this.shims[wk] = shim;
                }
                if (wk != this.currWeek) {
                    shim.boxInfo = dayEl.getBox();
                    this.currWeek = wk;
                }
                else {
                    box = dayEl.getBox();
                    shim.boxInfo.right = box.right;
                    shim.boxInfo.width = box.right - shim.boxInfo.x;
                }
                shim.isActive = true;
            }
            dt = D.add(dt, {days: 1});
        }

        Ext.each(this.shims, function(shim) {
            if (shim) {
                if (shim.isActive) {
                    shim.show();
                    shim.setBox(shim.boxInfo);
                }
                else if (shim.isVisible()) {
                    shim.hide();
                }
            }
        });
    },

    createShim: function() {
        if (!this.shimCt) {
            this.shimCt = Ext.get('ext-dd-shim-ct');
            if (!this.shimCt) {
                this.shimCt = document.createElement('div');
                this.shimCt.id = 'ext-dd-shim-ct';
                Ext.getBody().appendChild(this.shimCt);
            }
        }
        var el = document.createElement('div');
        el.className = 'ext-dd-shim';
        this.shimCt.appendChild(el);

        return new Ext.Layer({
            shadow: false,
            useDisplay: true,
            constrain: false
        },
        el);
    },

    clearShims: function() {
        Ext.each(this.shims,
        function(shim) {
            if (shim) {
                shim.hide();
            }
        });
        this.DDMInstance.notifyOccluded = false;
    },

    onContainerOver: function(dd, e, data) {
        return this.dropAllowed;
    },

    onCalendarDragComplete: function() {
        delete this.dragStartDate;
        delete this.dragEndDate;
        this.clearShims();
    },

    onNodeDrop: function(n, dd, e, data) {
        if (n && data) {
            if (data.type == 'eventdrag') {
                var rec = this.view.getEventRecordFromEl(data.ddel),
                dt = Ext.calendar.util.Date.copyTime(rec.data[Ext.calendar.data.EventMappings.StartDate.name], n.date);

                this.view.onEventDrop(rec, dt);
                this.onCalendarDragComplete();
                return true;
            }
            if (data.type == 'caldrag') {
                this.view.onCalendarEndDrag(this.dragStartDate, this.dragEndDate,
                Ext.bind(this.onCalendarDragComplete, this));
                //shims are NOT cleared here -- they stay visible until the handling
                //code calls the onCalendarDragComplete callback which hides them.
                return true;
            }
        }
        this.onCalendarDragComplete();
        return false;
    },

    onContainerDrop: function(dd, e, data) {
        this.onCalendarDragComplete();
        return false;
    }
});




/* ----- /calendar/src/util/WeekEventRenderer.js ----- */

/* @private
 * This is an internal helper class for the calendar views and should not be overridden.
 * It is responsible for the base event rendering logic underlying all views based on a 
 * box-oriented layout that supports day spanning (MonthView, MultiWeekView, DayHeaderView).
 */
Ext.define('Ext.calendar.util.WeekEventRenderer', {

    requires: ['Ext.calendar.util.Date'],
    
    statics: {
        // private
        getEventRow: function(id, week, index) {
            var indexOffset = 1,
                //skip row with date #'s
                evtRow,
                wkRow = Ext.get(id + '-wk-' + week);
            if (wkRow) {
                var table = wkRow.child('.ext-cal-evt-tbl', true);
                evtRow = table.tBodies[0].childNodes[index + indexOffset];
                if (!evtRow) {
                    evtRow = Ext.core.DomHelper.append(table.tBodies[0], '<tr></tr>');
                }
            }
            return Ext.get(evtRow);
        },

        render: function(o) {
            var w = 0,
                grid = o.eventGrid,
                dt = Ext.Date.clone(o.viewStart),
                eventTpl = o.tpl,
                max = o.maxEventsPerDay != undefined ? o.maxEventsPerDay: 999,
                weekCount = o.weekCount < 1 ? 6: o.weekCount,
                dayCount = o.weekCount == 1 ? o.dayCount: 7,
                cellCfg;

            for (; w < weekCount; w++) {
                if (!grid[w] || grid[w].length == 0) {
                    // no events or span cells for the entire week
                    if (weekCount == 1) {
                        row = this.getEventRow(o.id, w, 0);
                        cellCfg = {
                            tag: 'td',
                            cls: 'ext-cal-ev',
                            id: o.id + '-empty-0-day-' + Ext.Date.format(dt, 'Ymd'),
                            html: '&#160;'
                        };
                        if (dayCount > 1) {
                            cellCfg.colspan = dayCount;
                        }
                        Ext.core.DomHelper.append(row, cellCfg);
                    }
                    dt = Ext.calendar.util.Date.add(dt, {days: 7});
                } else {
                    var row,
                        d = 0,
                        wk = grid[w],
                        startOfWeek = Ext.Date.clone(dt),
                        endOfWeek = Ext.calendar.util.Date.add(startOfWeek, {days: dayCount, millis: -1});

                    for (; d < dayCount; d++) {
                        if (wk[d]) {
                            var ev = 0,
                                emptyCells = 0,
                                skipped = 0,
                                day = wk[d],
                                ct = day.length,
                                evt;

                            for (; ev < ct; ev++) {
                                evt = day[ev];

                                // Add an empty cell for days that have sparse arrays.
                                // See EXTJSIV-7832.
                                if (!evt && (ev < max)) {
                                    row = this.getEventRow(o.id, w, ev);
                                    cellCfg = {
                                        tag: 'td',
                                        cls: 'ext-cal-ev',
                                        id: o.id + '-empty-' + ct + '-day-' + Ext.Date.format(dt, 'Ymd')
                                    };

                                    Ext.core.DomHelper.append(row, cellCfg);
                                }

                                if (!evt) {
                                    continue;
                                }

                                if (ev >= max) {
                                    skipped++;
                                    continue;
                                }

                                if (!evt.isSpan || evt.isSpanStart) {
                                    //skip non-starting span cells
                                    var item = evt.data || evt.event.data;
                                    item._weekIndex = w;
                                    item._renderAsAllDay = item[Ext.calendar.data.EventMappings.IsAllDay.name] || evt.isSpanStart;
                                    item.spanLeft = item[Ext.calendar.data.EventMappings.StartDate.name].getTime() < startOfWeek.getTime();
                                    item.spanRight = item[Ext.calendar.data.EventMappings.EndDate.name].getTime() > endOfWeek.getTime();
                                    item.spanCls = (item.spanLeft ? (item.spanRight ? 'ext-cal-ev-spanboth':
                                    'ext-cal-ev-spanleft') : (item.spanRight ? 'ext-cal-ev-spanright': ''));

                                    row = this.getEventRow(o.id, w, ev);
                                    cellCfg = {
                                        tag: 'td',
                                        cls: 'ext-cal-ev',
                                        cn: eventTpl.apply(o.templateDataFn(item))
                                    };
                                    var diff = Ext.calendar.util.Date.diffDays(dt, item[Ext.calendar.data.EventMappings.EndDate.name]) + 1,
                                        cspan = Math.min(diff, dayCount - d);

                                    if (cspan > 1) {
                                        cellCfg.colspan = cspan;
                                    }
                                    Ext.core.DomHelper.append(row, cellCfg);
                                }
                            }
                            if (ev > max) {
                                row = this.getEventRow(o.id, w, max);
                                Ext.core.DomHelper.append(row, {
                                    tag: 'td',
                                    cls: 'ext-cal-ev-more',
                                    id: 'ext-cal-ev-more-' + Ext.Date.format(dt, 'Ymd'),
                                    cn: {
                                        tag: 'a',
                                        html: '+' + skipped + ' more...'
                                    }
                                });
                            }
                            if (ct < o.evtMaxCount[w]) {
                                row = this.getEventRow(o.id, w, ct);
                                if (row) {
                                    cellCfg = {
                                        tag: 'td',
                                        cls: 'ext-cal-ev',
                                        id: o.id + '-empty-' + (ct + 1) + '-day-' + Ext.Date.format(dt, 'Ymd')
                                    };
                                    var rowspan = o.evtMaxCount[w] - ct;
                                    if (rowspan > 1) {
                                        cellCfg.rowspan = rowspan;
                                    }
                                    Ext.core.DomHelper.append(row, cellCfg);
                                }
                            }
                        } else {
                            row = this.getEventRow(o.id, w, 0);
                            if (row) {
                                cellCfg = {
                                    tag: 'td',
                                    cls: 'ext-cal-ev',
                                    id: o.id + '-empty-day-' + Ext.Date.format(dt, 'Ymd')
                                };
                                if (o.evtMaxCount[w] > 1) {
                                    cellCfg.rowSpan = o.evtMaxCount[w];
                                }
                                Ext.core.DomHelper.append(row, cellCfg);
                            }
                        }
                        dt = Ext.calendar.util.Date.add(dt, {days: 1});
                    }
                }
            }
        }
    }
});




/* ----- /calendar/src/template/Month.js ----- */

/**
 * @class Ext.calendar.template.Month
 * @extends Ext.XTemplate
 * <p>This is the template used to render the {@link Ext.calendar.template.Month MonthView}. Internally this class defers to an
 * instance of {@link Ext.calerndar.BoxLayoutTemplate} to handle the inner layout rendering and adds containing elements around
 * that to form the month view.</p> 
 * <p>This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.calendar.EventRecord}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.template.Month', {
    extend: 'Ext.XTemplate',
    
    requires: ['Ext.calendar.template.BoxLayout'],
    
    constructor: function(config){
        
        Ext.apply(this, config);
    
        this.weekTpl = new Ext.calendar.template.BoxLayout(config);
        this.weekTpl.compile();
        
        var weekLinkTpl = this.showWeekLinks ? '<div class="ext-cal-week-link-hd">&#160;</div>' : '';
        
        this.callParent([
            '<div class="ext-cal-inner-ct {extraClasses}">',
                '<div class="ext-cal-hd-ct ext-cal-month-hd">',
                    weekLinkTpl,
                    '<table class="ext-cal-hd-days-tbl" cellpadding="0" cellspacing="0">',
                        '<tbody>',
                            '<tr>',
                                '<tpl for="days">',
                                    '<th class="ext-cal-hd-day{[xindex==1 ? " ext-cal-day-first" : ""]}" title="{.:date("l, F j, Y")}">{.:date("D")}</th>',
                                '</tpl>',
                            '</tr>',
                        '</tbody>',
                    '</table>',
                '</div>',
                '<div class="ext-cal-body-ct">{weeks}</div>',
            '</div>'
        ]);
    },

    // private
    applyTemplate : function(o){
        var days = [],
            weeks = this.weekTpl.apply(o),
            dt = o.viewStart,
            D = Ext.calendar.util.Date;
        
        for(var i = 0; i < 7; i++){
            days.push(D.add(dt, {days: i}));
        }
        
        var extraClasses = this.showHeader === true ? '' : 'ext-cal-noheader';
        if(this.showWeekLinks){
            extraClasses += ' ext-cal-week-links';
        }
        
        return this.applyOut({
            days: days,
            weeks: weeks,
            extraClasses: extraClasses
        }, []).join('');
    },
    
    apply: function(values) {
        return this.applyTemplate.apply(this, arguments);
    }
});



/* ----- /calendar/src/view/MonthDayDetail.js ----- */

/*
 * This is the view used internally by the panel that displays overflow events in the
 * month view. Anytime a day cell cannot display all of its events, it automatically displays
 * a link at the bottom to view all events for that day. When clicked, a panel pops up that
 * uses this view to display the events for that day.
 */
Ext.define('Ext.calendar.view.MonthDayDetail', {
    extend: 'Ext.Component',
    alias: 'widget.monthdaydetailview',

    requires: [
        'Ext.XTemplate',
        'Ext.calendar.util.Date',
        'Ext.calendar.view.AbstractCalendar'
    ],

    afterRender: function() {
        this.tpl = this.getTemplate();

        this.callParent(arguments);

        this.el.on({
            click: this.view.onClick,
            mouseover: this.view.onMouseOver,
            mouseout: this.view.onMouseOut,
            scope: this.view
        });
    },

    getTemplate: function() {
        if (!this.tpl) {
            this.tpl = new Ext.XTemplate(
                '<div class="ext-cal-mdv x-unselectable">',
                    '<table class="ext-cal-mvd-tbl" cellpadding="0" cellspacing="0">',
                        '<tbody>',
                            '<tpl for=".">',
                                '<tr><td class="ext-cal-ev">{markup}</td></tr>',
                            '</tpl>',
                        '</tbody>',
                    '</table>',
                '</div>'
            );
        }
        this.tpl.compile();
        return this.tpl;
    },

    update: function(dt) {
        this.date = dt;
        this.refresh();
    },

    refresh: function() {
        if (!this.rendered) {
            return;
        }
        var eventTpl = this.view.getEventTemplate(),

        templateData = [],

        evts = this.store.queryBy(function(rec) {
            var thisDt = Ext.Date.clearTime(this.date, true).getTime(),
                recStart = Ext.Date.clearTime(rec.data[Ext.calendar.data.EventMappings.StartDate.name], true).getTime(),
                startsOnDate = (thisDt == recStart),
                spansDate = false;

            if (!startsOnDate) {
                var recEnd = Ext.Date.clearTime(rec.data[Ext.calendar.data.EventMappings.EndDate.name], true).getTime();
                spansDate = recStart < thisDt && recEnd >= thisDt;
            }
            return startsOnDate || spansDate;
        },
        this);

        evts.each(function(evt) {
            var item = evt.data,
            M = Ext.calendar.data.EventMappings;

            item._renderAsAllDay = item[M.IsAllDay.name] || Ext.calendar.util.Date.diffDays(item[M.StartDate.name], item[M.EndDate.name]) > 0;
            item.spanLeft = Ext.calendar.util.Date.diffDays(item[M.StartDate.name], this.date) > 0;
            item.spanRight = Ext.calendar.util.Date.diffDays(this.date, item[M.EndDate.name]) > 0;
            item.spanCls = (item.spanLeft ? (item.spanRight ? 'ext-cal-ev-spanboth':
            'ext-cal-ev-spanleft') : (item.spanRight ? 'ext-cal-ev-spanright': ''));

            templateData.push({
                markup: eventTpl.apply(this.getTemplateEventData(item))
            });
        },
        this);

        this.tpl.overwrite(this.el, templateData);
        this.fireEvent('eventsrendered', this, this.date, evts.getCount());
    },

    getTemplateEventData: function(evt) {
        var data = this.view.getTemplateEventData(evt);
        data._elId = 'dtl-' + data._elId;
        return data;
    }
});




/* ----- /calendar/src/view/Month.js ----- */

/**
 * @class Ext.calendar.view.Month
 * @extends Ext.calendar.CalendarView
 * <p>Displays a calendar view by month. This class does not usually need ot be used directly as you can
 * use a {@link Ext.calendar.CalendarPanel CalendarPanel} to manage multiple calendar views at once including
 * the month view.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.view.Month', {
    extend: 'Ext.calendar.view.AbstractCalendar',
    alias: 'widget.monthview',
    
    requires: [
        'Ext.XTemplate',
        'Ext.calendar.template.Month',
        'Ext.calendar.util.WeekEventRenderer',
        'Ext.calendar.view.MonthDayDetail'
    ],
    
    /**
     * @cfg {Boolean} showTime
     * True to display the current time in today's box in the calendar, false to not display it (defautls to true)
     */
    showTime: true,
    /**
     * @cfg {Boolean} showTodayText
     * True to display the {@link #todayText} string in today's box in the calendar, false to not display it (defautls to true)
     */
    showTodayText: true,
    /**
     * @cfg {String} todayText
     * The text to display in the current day's box in the calendar when {@link #showTodayText} is true (defaults to 'Today')
     */
    todayText: 'Today',
    /**
     * @cfg {Boolean} showHeader
     * True to display a header beneath the navigation bar containing the week names above each week's column, false not to 
     * show it and instead display the week names in the first row of days in the calendar (defaults to false).
     */
    showHeader: false,
    /**
     * @cfg {Boolean} showWeekLinks
     * True to display an extra column before the first day in the calendar that links to the {@link Ext.calendar.WeekView view}
     * for each individual week, false to not show it (defaults to false). If true, the week links can also contain the week 
     * number depending on the value of {@link #showWeekNumbers}.
     */
    showWeekLinks: false,
    /**
     * @cfg {Boolean} showWeekNumbers
     * True to show the week number for each week in the calendar in the week link column, false to show nothing (defaults to false).
     * Note that if {@link #showWeekLinks} is false this config will have no affect even if true.
     */
    showWeekNumbers: false,
    /**
     * @cfg {String} weekLinkOverClass
     * The CSS class name applied when the mouse moves over a week link element (only applies when {@link #showWeekLinks} is true,
     * defaults to 'ext-week-link-over').
     */
    weekLinkOverClass: 'ext-week-link-over',

    //private properties -- do not override:
    daySelector: '.ext-cal-day',
    moreSelector: '.ext-cal-ev-more',
    weekLinkSelector: '.ext-cal-week-link',
    weekCount: -1,
    // defaults to auto by month
    dayCount: 7,
    moreElIdDelimiter: '-more-',
    weekLinkIdDelimiter: 'ext-cal-week-',

    // See EXTJSIV-11407.
    operaLT11: Ext.isOpera && (parseInt(Ext.operaVersion) < 11),

    /**
     * @event dayclick
     * Fires after the user clicks within the view container and not on an event element
     * @param {Ext.calendar.view.Month} this
     * @param {Date} dt The date/time that was clicked on
     * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
     * MonthView always return true for this param.
     * @param {Ext.core.Element} el The Element that was clicked on
     */

    /**
     * @event weekclick
     * Fires after the user clicks within a week link (when {@link #showWeekLinks is true)
     * @param {Ext.calendar.view.Month} this
     * @param {Date} dt The start date of the week that was clicked on
     */

    // inherited docs
    //dayover: true,
    // inherited docs
    //dayout: true

    // private
    initDD: function() {
        var cfg = {
            view: this,
            createText: this.ddCreateEventText,
            moveText: this.ddMoveEventText,
            ddGroup: 'MonthViewDD'
        };

        this.dragZone = new Ext.calendar.dd.DragZone(this.el, cfg);
        this.dropZone = new Ext.calendar.dd.DropZone(this.el, cfg);
    },

    // private
    onDestroy: function() {
        Ext.destroy(this.ddSelector);
        Ext.destroy(this.dragZone);
        Ext.destroy(this.dropZone);
        
        this.callParent(arguments);
    },

    // private
    afterRender: function() {
        if (!this.tpl) {
            this.tpl = new Ext.calendar.template.Month({
                id: this.id,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime,
                showHeader: this.showHeader,
                showWeekLinks: this.showWeekLinks,
                showWeekNumbers: this.showWeekNumbers
            });
        }
        this.tpl.compile();
        this.addCls('ext-cal-monthview ext-cal-ct');

        this.callParent(arguments);
    },

    // private
    onResize: function() {
        var me = this;
        me.callParent(arguments);
        me.maxEventsPerDay = me.getMaxEventsPerDay();
        if (me.monitorResize) {
            me.refresh();
        }
    },

    // private
    forceSize: function() {
        // Compensate for the week link gutter width if visible
        if(this.showWeekLinks && this.el){
            var hd = this.el.down('.ext-cal-hd-days-tbl'),
                bgTbl = this.el.select('.ext-cal-bg-tbl'),
                evTbl = this.el.select('.ext-cal-evt-tbl'),
                wkLinkW = this.el.down('.ext-cal-week-link').getWidth(),
                w = this.el.getWidth()-wkLinkW;
            
            hd.setWidth(w);
            bgTbl.setWidth(w);
            evTbl.setWidth(w);
        }
        this.callParent(arguments);
    },

    //private
    initClock: function() {
        if (Ext.fly(this.id + '-clock') !== null) {
            this.prevClockDay = new Date().getDay();
            if (this.clockTask) {
                Ext.TaskManager.stop(this.clockTask);
            }
            this.clockTask = Ext.TaskManager.start({
                run: function() {
                    var el = Ext.fly(this.id + '-clock'),
                    t = new Date();

                    if (t.getDay() == this.prevClockDay) {
                        if (el) {
                            el.update(Ext.Date.format(t, 'g:i a'));
                        }
                    }
                    else {
                        this.prevClockDay = t.getDay();
                        this.moveTo(t);
                    }
                },
                scope: this,
                interval: 1000
            });
        }
    },

    // inherited docs
    getEventBodyMarkup: function() {
        if (!this.eventBodyMarkup) {
            this.eventBodyMarkup = ['{Title}',
            '<tpl if="_isReminder">',
                '<i class="ext-cal-ic ext-cal-ic-rem">&#160;</i>',
            '</tpl>',
            '<tpl if="_isRecurring">',
                '<i class="ext-cal-ic ext-cal-ic-rcr">&#160;</i>',
            '</tpl>',
            '<tpl if="spanLeft">',
                '<i class="ext-cal-spl">&#160;</i>',
            '</tpl>',
            '<tpl if="spanRight">',
                '<i class="ext-cal-spr">&#160;</i>',
            '</tpl>'
            ].join('');
        }
        return this.eventBodyMarkup;
    },

    // inherited docs
    getEventTemplate: function() {
        if (!this.eventTpl) {
            var tpl,
            body = this.getEventBodyMarkup();

            tpl = !(Ext.isIE || this.operaLT11) ?
            new Ext.XTemplate(
                '<div id="{_elId}" class="{_selectorCls} {_colorCls} {spanCls} ext-cal-evt ext-cal-evr">',
                    body,
                '</div>'
            )
            : new Ext.XTemplate(
                '<tpl if="_renderAsAllDay">',
                    '<div id="{_elId}" class="{_selectorCls} {spanCls} {_colorCls} {_operaLT11} ext-cal-evo">',
                        '<div class="ext-cal-evm">',
                            '<div class="ext-cal-evi">',
                '</tpl>',
                '<tpl if="!_renderAsAllDay">',
                    '<div id="{_elId}" class="{_selectorCls} {_colorCls} {_operaLT11} ext-cal-evt ext-cal-evr">',
                '</tpl>',
                    body,
                '<tpl if="_renderAsAllDay">',
                            '</div>',
                        '</div>',
                '</tpl>',
                    '</div>'
            );
            tpl.compile();
            this.eventTpl = tpl;
        }
        return this.eventTpl;
    },

    // private
    getTemplateEventData: function(evt) {
        var M = Ext.calendar.data.EventMappings,
        selector = this.getEventSelectorCls(evt[M.EventId.name]),
        title = evt[M.Title.name];

        return Ext.applyIf({
            _selectorCls: selector,
            _colorCls: 'ext-color-' + (evt[M.CalendarId.name] ?
            evt[M.CalendarId.name] : 'default') + (evt._renderAsAllDay ? '-ad': ''),
            _elId: selector + '-' + evt._weekIndex,
            _isRecurring: evt.Recurrence && evt.Recurrence != '',
            _isReminder: evt[M.Reminder.name] && evt[M.Reminder.name] != '',
            Title: (evt[M.IsAllDay.name] ? '' : Ext.Date.format(evt[M.StartDate.name], 'g:ia ')) + (!title || title.length == 0 ? '(No title)' : title),
            _operaLT11: this.operaLT11 ? 'ext-operaLT11' : ''
        },
        evt);
    },

    // private
    refresh: function() {
        if (this.detailPanel) {
            this.detailPanel.hide();
        }
        this.callParent(arguments);

        if (this.showTime !== false) {
            this.initClock();
        }
    },

    // private
    renderItems: function() {
        Ext.calendar.util.WeekEventRenderer.render({
            eventGrid: this.allDayOnly ? this.allDayGrid: this.eventGrid,
            viewStart: this.viewStart,
            tpl: this.getEventTemplate(),
            maxEventsPerDay: this.getMaxEventsPerDay(),
            id: this.id,
            templateDataFn: Ext.bind(this.getTemplateEventData, this),
            evtMaxCount: this.evtMaxCount,
            weekCount: this.weekCount,
            dayCount: this.dayCount
        });
        this.fireEvent('eventsrendered', this);
    },

    // private
    getDayEl: function(dt) {
        return Ext.get(this.getDayId(dt));
    },

    // private
    getDayId: function(dt) {
        if (Ext.isDate(dt)) {
            dt = Ext.Date.format(dt, 'Ymd');
        }
        return this.id + this.dayElIdDelimiter + dt;
    },

    // private
    getWeekIndex: function(dt) {
        var el = this.getDayEl(dt).up('.ext-cal-wk-ct');
        return parseInt(el.id.split('-wk-')[1], 10);
    },

    // private
    getDaySize : function(contentOnly){
        var box = this.el.getBox(),
            padding = this.getViewPadding(),
            w = (box.width - padding.width) / this.dayCount,
            h = (box.height - padding.height) / this.getWeekCount();
            
        if(contentOnly){
            // measure last row instead of first in case text wraps in first row
            var hd = this.el.select('.ext-cal-dtitle').last().parent('tr');
            h = hd ? h-hd.getHeight(true) : h;
        }
        return {height: h, width: w};
    },
    
    // private
    getEventHeight : function() {
        if (!this.eventHeight) {
            var evt = this.el.select('.ext-cal-evt').first();
            if(evt){
                this.eventHeight = evt.parent('td').getHeight();
            }
            else {
                return 16; // no events rendered, so try setting this.eventHeight again later
            }
        }
        return this.eventHeight;
    },
    
    // private
    getMaxEventsPerDay : function(){
        var dayHeight = this.getDaySize(true).height,
            eventHeight = this.getEventHeight(),
            max = Math.max(Math.floor((dayHeight - eventHeight) / eventHeight), 0);
        
        return max;
    },
    
    // private
    getViewPadding: function(sides) {
        var sides = sides || 'tlbr',
            top = sides.indexOf('t') > -1,
            left = sides.indexOf('l') > -1,
            right = sides.indexOf('r') > -1,
            height = this.showHeader && top ? this.el.select('.ext-cal-hd-days-tbl').first().getHeight() : 0,
            width = 0;
        
        if (this.isHeaderView) {
            if (left) {
                width = this.el.select('.ext-cal-gutter').first().getWidth();
            }
            if (right) {
                width += this.el.select('.ext-cal-gutter-rt').first().getWidth();
            }
        }
        else if (this.showWeekLinks && left) {
            width = this.el.select('.ext-cal-week-link').first().getWidth();
        }
        
        return {
            height: height,
            width: width
        }
    },

    // private
    getDayAt: function(x, y) {
        var box = this.el.getBox(),
            daySize = this.getDaySize(),
            dayL = Math.floor(((x - box.x) / daySize.width)),
            dayT = Math.floor(((y - box.y) / daySize.height)),
            days = (dayT * 7) + dayL,
            dt = Ext.calendar.util.Date.add(this.viewStart, {days: days});
        return {
            date: dt,
            el: this.getDayEl(dt)
        };
    },

    // inherited docs
    moveNext: function() {
        return this.moveMonths(1);
    },

    // inherited docs
    movePrev: function() {
        return this.moveMonths( - 1);
    },

    // private
    onInitDrag: function() {
        this.callParent(arguments);
        
        if (this.dayOverClass) {
            Ext.select(this.daySelector).removeCls(this.dayOverClass);
        }
        if (this.detailPanel) {
            this.detailPanel.hide();
        }
    },

    // private
    onMoreClick: function(dt) {
        if (!this.detailPanel) {
            this.detailPanel = Ext.create('Ext.Panel', {
                id: this.id + '-details-panel',
                title: Ext.Date.format(dt, 'F j'),
                layout: 'fit',
                floating: true,
                renderTo: Ext.getBody(),
                tools: [{
                    type: 'close',
                    handler: function(e, t, p) {
                        p.ownerCt.hide();
                    }
                }],
                items: {
                    xtype: 'monthdaydetailview',
                    id: this.id + '-details-view',
                    date: dt,
                    view: this,
                    store: this.store,
                    listeners: {
                        'eventsrendered': Ext.bind(this.onDetailViewUpdated, this)
                    }
                }
            });
        }
        else {
            this.detailPanel.setTitle(Ext.Date.format(dt, 'F j'));
        }
        this.detailPanel.getComponent(this.id + '-details-view').update(dt);
    },

    // private
    onDetailViewUpdated : function(view, dt, numEvents){
        var p = this.detailPanel,
            dayEl = this.getDayEl(dt),
            box = dayEl.getBox();
        
        p.setWidth(Math.max(box.width, 220));
        p.show();
        p.getEl().alignTo(dayEl, 't-t?');
    },

    // private
    onHide: function() {
        this.callParent(arguments);
        
        if (this.detailPanel) {
            this.detailPanel.hide();
        }
    },

    // private
    onClick: function(e, t) {
        if (this.detailPanel) {
            this.detailPanel.hide();
        }
        if (Ext.calendar.view.Month.superclass.onClick.apply(this, arguments)) {
            // The superclass handled the click already so exit
            return;
        }
        if (this.dropZone) {
            this.dropZone.clearShims();
        }
        var el = e.getTarget(this.weekLinkSelector, 3),
            dt,
            parts;
        if (el) {
            dt = el.id.split(this.weekLinkIdDelimiter)[1];
            this.fireEvent('weekclick', this, Ext.Date.parseDate(dt, 'Ymd'));
            return;
        }
        el = e.getTarget(this.moreSelector, 3);
        if (el) {
            dt = el.id.split(this.moreElIdDelimiter)[1];
            this.onMoreClick(Ext.Date.parseDate(dt, 'Ymd'));
            return;
        }
        el = e.getTarget('td', 3);
        if (el) {
            if (el.id && el.id.indexOf(this.dayElIdDelimiter) > -1) {
                parts = el.id.split(this.dayElIdDelimiter);
                dt = parts[parts.length - 1];

                this.fireEvent('dayclick', this, Ext.Date.parseDate(dt, 'Ymd'), false, Ext.get(this.getDayId(dt)));
                return;
            }
        }
    },

    // private
    handleDayMouseEvent: function(e, t, type) {
        var el = e.getTarget(this.weekLinkSelector, 3, true);
        if (el && this.weekLinkOverClass) {
            el[type == 'over' ? 'addCls': 'removeCls'](this.weekLinkOverClass);
            return;
        }
        this.callParent(arguments);
    }
});




/* ----- /calendar/src/template/DayHeader.js ----- */

/**
 * @class Ext.calendar.template.DayHeader
 * @extends Ext.XTemplate
 * <p>This is the template used to render the all-day event container used in {@link Ext.calendar.DayView DayView} and 
 * {@link Ext.calendar.WeekView WeekView}. Internally the majority of the layout logic is deferred to an instance of
 * {@link Ext.calendar.BoxLayoutTemplate}.</p> 
 * <p>This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.calendar.EventRecord}.</p>
 * <p>Note that this template would not normally be used directly. Instead you would use the {@link Ext.calendar.DayViewTemplate}
 * that internally creates an instance of this template along with a {@link Ext.calendar.DayBodyTemplate}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.template.DayHeader', {
    extend: 'Ext.XTemplate',
    
    requires: ['Ext.calendar.template.BoxLayout'],
    
    constructor: function(config){
        
        Ext.apply(this, config);
        
        this.allDayTpl = new Ext.calendar.template.BoxLayout(config);
        this.allDayTpl.compile();
        
        this.callParent([
            '<div class="ext-cal-hd-ct">',
                '<table class="ext-cal-hd-days-tbl" cellspacing="0" cellpadding="0">',
                    '<tbody>',
                        '<tr>',
                            '<td class="ext-cal-gutter"></td>',
                            '<td class="ext-cal-hd-days-td"><div class="ext-cal-hd-ad-inner">{allDayTpl}</div></td>',
                            '<td class="ext-cal-gutter-rt"></td>',
                        '</tr>',
                    '</tobdy>',
                '</table>',
            '</div>'
        ]);
    },

    applyTemplate : function(o){
        return this.applyOut({
            allDayTpl: this.allDayTpl.apply(o)
        }, []).join('');
    },
    
    apply: function(values) {
        return this.applyTemplate.apply(this, arguments);
    }
});



/* ----- /calendar/src/dd/DayDragZone.js ----- */

/*
 * Internal drag zone implementation for the calendar day and week views.
 */
Ext.define('Ext.calendar.dd.DayDragZone', {
    extend: 'Ext.calendar.dd.DragZone',
    requires: [
        'Ext.calendar.data.EventMappings'
    ],

    ddGroup: 'DayViewDD',
    resizeSelector: '.ext-evt-rsz',

    getDragData: function(e) {
        var startDateName = Ext.calendar.data.EventMappings.StartDate.name,
            endDateName = Ext.calendar.data.EventMappings.EndDate.name,
            t, p, rec;
        
        t = e.getTarget(this.resizeSelector, 2, true);
        
        if (t) {
            p = t.parent(this.eventSelector);
            rec = this.view.getEventRecordFromEl(p);

            return {
                type: 'eventresize',
                ddel: p.dom,
                eventStart: rec.get(startDateName),
                eventEnd: rec.get(endDateName),
                proxy: this.proxy
            };
        }
        
        t = e.getTarget(this.eventSelector, 3);
        if (t) {
            rec = this.view.getEventRecordFromEl(t);
            return {
                type: 'eventdrag',
                ddel: t,
                eventStart: rec.get(startDateName),
                eventEnd: rec.get(endDateName),
                proxy: this.proxy
            };
        }

        // If not dragging/resizing an event then we are dragging on
        // the calendar to add a new event
        t = this.view.getDayAt(e.getX(), e.getY());
        if (t.el) {
            return {
                type: 'caldrag',
                dayInfo: t,
                proxy: this.proxy
            };
        }
        return null;
    }
});



/* ----- /calendar/src/dd/DayDropZone.js ----- */

/*
 * Internal drop zone implementation for the calendar day and week views.
 */
Ext.define('Ext.calendar.dd.DayDropZone', {
    extend: 'Ext.calendar.dd.DropZone',
    requires: [
        'Ext.calendar.util.Date'
    ],

    ddGroup: 'DayViewDD',

    onNodeOver: function(n, dd, e, data) {
        var dt,
            box,
            endDt,
            text = this.createText,
            curr,
            start,
            end,
            evtEl,
            dayCol;
        if (data.type == 'caldrag') {
            if (!this.dragStartMarker) {
                // Since the container can scroll, this gets a little tricky.
                // There is no el in the DOM that we can measure by default since
                // the box is simply calculated from the original drag start (as opposed
                // to dragging or resizing the event where the orig event box is present).
                // To work around this we add a placeholder el into the DOM and give it
                // the original starting time's box so that we can grab its updated
                // box measurements as the underlying container scrolls up or down.
                // This placeholder is removed in onNodeDrop.
                this.dragStartMarker = n.el.parent().createChild({
                    style: 'position:absolute;'
                });
                this.dragStartMarker.setBox(n.timeBox);
                this.dragCreateDt = n.date;
            }
            box = this.dragStartMarker.getBox();
            box.height = Math.ceil(Math.abs(e.xy[1] - box.y) / n.timeBox.height) * n.timeBox.height;

            if (e.xy[1] < box.y) {
                box.height += n.timeBox.height;
                box.y = box.y - box.height + n.timeBox.height;
                endDt = Ext.Date.add(this.dragCreateDt, Ext.Date.MINUTE, 30);
            }
            else {
                n.date = Ext.Date.add(n.date, Ext.Date.MINUTE, 30);
            }
            this.shim(this.dragCreateDt, box);

            curr = Ext.calendar.util.Date.copyTime(n.date, this.dragCreateDt);
            this.dragStartDate = Ext.calendar.util.Date.min(this.dragCreateDt, curr);
            this.dragEndDate = endDt || Ext.calendar.util.Date.max(this.dragCreateDt, curr);

            dt = Ext.Date.format(this.dragStartDate, 'g:ia-') + Ext.Date.format(this.dragEndDate, 'g:ia');
        }
        else {
            evtEl = Ext.get(data.ddel);
            dayCol = evtEl.parent().parent();
            box = evtEl.getBox();

            box.width = dayCol.getWidth();

            if (data.type == 'eventdrag') {
                if (this.dragOffset === undefined) {
                    this.dragOffset = n.timeBox.y - box.y;
                    box.y = n.timeBox.y - this.dragOffset;
                }
                else {
                    box.y = n.timeBox.y;
                }
                dt = Ext.Date.format(n.date, 'n/j g:ia');
                box.x = n.el.getX();

                this.shim(n.date, box);
                text = this.moveText;
            }
            if (data.type == 'eventresize') {
                if (!this.resizeDt) {
                    this.resizeDt = n.date;
                }
                box.x = dayCol.getX();
                box.height = Math.ceil(Math.abs(e.xy[1] - box.y) / n.timeBox.height) * n.timeBox.height;
                if (e.xy[1] < box.y) {
                    box.y -= box.height;
                }
                else {
                    n.date = Ext.Date.add(n.date, Ext.Date.MINUTE, 30);
                }
                this.shim(this.resizeDt, box);

                curr = Ext.calendar.util.Date.copyTime(n.date, this.resizeDt);
                start = Ext.calendar.util.Date.min(data.eventStart, curr);
                end = Ext.calendar.util.Date.max(data.eventStart, curr);

                data.resizeDates = {
                    StartDate: start,
                    EndDate: end
                };
                dt = Ext.Date.format(start, 'g:ia-') + Ext.Date.format(end, 'g:ia');
                text = this.resizeText;
            }
        }

        data.proxy.updateMsg(Ext.util.Format.format(text, dt));
        return this.dropAllowed;
    },

    shim: function(dt, box) {
        Ext.each(this.shims,
            function(shim) {
                if (shim) {
                    shim.isActive = false;
                    shim.hide();
                }
            }
        );

        var shim = this.shims[0];
        if (!shim) {
            shim = this.createShim();
            this.shims[0] = shim;
        }

        shim.isActive = true;
        shim.show();
        shim.setBox(box);
        this.DDMInstance.notifyOccluded = true;
    },

    onNodeDrop: function(n, dd, e, data) {
        var rec;
        if (n && data) {
            if (data.type == 'eventdrag') {
                rec = this.view.getEventRecordFromEl(data.ddel);
                this.view.onEventDrop(rec, n.date);
                this.onCalendarDragComplete();
                delete this.dragOffset;
                return true;
            }
            if (data.type == 'eventresize') {
                rec = this.view.getEventRecordFromEl(data.ddel);
                this.view.onEventResize(rec, data.resizeDates);
                this.onCalendarDragComplete();
                delete this.resizeDt;
                return true;
            }
            if (data.type == 'caldrag') {
                Ext.destroy(this.dragStartMarker);
                delete this.dragStartMarker;
                delete this.dragCreateDt;
                this.view.onCalendarEndDrag(this.dragStartDate, this.dragEndDate,
                Ext.bind(this.onCalendarDragComplete, this));
                //shims are NOT cleared here -- they stay visible until the handling
                //code calls the onCalendarDragComplete callback which hides them.
                return true;
            }
        }
        this.onCalendarDragComplete();
        return false;
    }
});




/* ----- /calendar/src/template/DayBody.js ----- */

/**
 * @class Ext.calendar.template.DayBody
 * @extends Ext.XTemplate
 * <p>This is the template used to render the scrolling body container used in {@link Ext.calendar.DayView DayView} and 
 * {@link Ext.calendar.WeekView WeekView}. This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Ext.calendar.EventRecord}.</p>
 * <p>Note that this template would not normally be used directly. Instead you would use the {@link Ext.calendar.DayViewTemplate}
 * that internally creates an instance of this template along with a {@link Ext.calendar.DayHeaderTemplate}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.template.DayBody', {
    extend: 'Ext.XTemplate',
    requires: [
        'Ext.calendar.util.Date'
    ],
    
    constructor: function(config){
        
        Ext.apply(this, config);

        this.callParent([
            '<table class="ext-cal-bg-tbl" cellspacing="0" cellpadding="0">',
                '<tbody>',
                    '<tr height="1">',
                        '<td class="ext-cal-gutter"></td>',
                        '<td colspan="{dayCount}">',
                            '<div class="ext-cal-bg-rows">',
                                '<div class="ext-cal-bg-rows-inner">',
                                    '<tpl for="times">',
                                        '<div class="ext-cal-bg-row">',
                                            '<div class="ext-cal-bg-row-div ext-row-{[xindex]}"></div>',
                                        '</div>',
                                    '</tpl>',
                                '</div>',
                            '</div>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td class="ext-cal-day-times">',
                            '<tpl for="times">',
                                '<div class="ext-cal-bg-row">',
                                    '<div class="ext-cal-day-time-inner">{.}</div>',
                                '</div>',
                            '</tpl>',
                        '</td>',
                        '<tpl for="days">',
                            '<td class="ext-cal-day-col">',
                                '<div class="ext-cal-day-col-inner">',
                                    '<div id="{[this.id]}-day-col-{.:date("Ymd")}" class="ext-cal-day-col-gutter"></div>',
                                '</div>',
                            '</td>',
                        '</tpl>',
                    '</tr>',
                '</tbody>',
            '</table>'
        ]);
    },

    // private
    applyTemplate : function(o){
        this.today = Ext.calendar.util.Date.today();
        this.dayCount = this.dayCount || 1;
        
        var i = 0,
            days = [],
            dt = Ext.Date.clone(o.viewStart),
            times = [];
            
        for(; i<this.dayCount; i++){
            days[i] = Ext.calendar.util.Date.add(dt, {days: i});
        }

        // use a fixed DST-safe date so times don't get skipped on DST boundaries
        dt = Ext.Date.clearTime(new Date('5/26/1972'));
        
        for(i=0; i<24; i++){
            times.push(Ext.Date.format(dt, 'ga'));
            dt = Ext.calendar.util.Date.add(dt, {hours: 1});
        }
        
        return this.applyOut({
            days: days,
            dayCount: days.length,
            times: times
        }, []).join('');
    },
    
    apply: function(values) {
        return this.applyTemplate.apply(this, arguments);
    }
});



/* ----- /calendar/src/view/DayBody.js ----- */

/**S
 * @class Ext.calendar.view.DayBody
 * @extends Ext.calendar.view.AbstractCalendar
 * <p>This is the scrolling container within the day and week views where non-all-day events are displayed.
 * Normally you should not need to use this class directly -- instead you should use {@link Ext.calendar.DayView DayView}
 * which aggregates this class and the {@link Ext.calendar.DayHeaderView DayHeaderView} into the single unified view
 * presented by {@link Ext.calendar.CalendarPanel CalendarPanel}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.view.DayBody', {
    extend: 'Ext.calendar.view.AbstractCalendar',
    alias: 'widget.daybodyview',

    requires: [
        'Ext.XTemplate',
        'Ext.calendar.template.DayBody',
        'Ext.calendar.data.EventMappings',
        'Ext.calendar.dd.DayDragZone',
        'Ext.calendar.dd.DayDropZone'
    ],
    
    //private
    dayColumnElIdDelimiter: '-day-col-',

    /**
     * @event eventresize
     * Fires after the user drags the resize handle of an event to resize it
     * @param {Ext.calendar.view.DayBody} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that was resized
     * containing the updated start and end dates
     */

    /**
     * @event dayclick
     * Fires after the user clicks within the day view container and not on an event element
     * @param {Ext.calendar.view.DayBody} this
     * @param {Date} dt The date/time that was clicked on
     * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
     * DayBodyView always return false for this param.
     * @param {Ext.core.Element} el The Element that was clicked on
     */

    //private
    initDD: function() {
        var cfg = {
            createText: this.ddCreateEventText,
            moveText: this.ddMoveEventText,
            resizeText: this.ddResizeEventText
        };

        this.el.ddScrollConfig = {
            // scrolling is buggy in IE/Opera for some reason.  A larger vthresh
            // makes it at least functional if not perfect
            vthresh: Ext.isIE || Ext.isOpera ? 100: 40,
            hthresh: -1,
            frequency: 50,
            increment: 100,
            ddGroup: 'DayViewDD'
        };
        this.dragZone = new Ext.calendar.dd.DayDragZone(this.el, Ext.apply({
            view: this,
            containerScroll: true
        },
        cfg));

        this.dropZone = new Ext.calendar.dd.DayDropZone(this.el, Ext.apply({
            view: this
        },
        cfg));
    },

    //private
    refresh: function() {
        var top = this.el.getScroll().top;
        this.prepareData();
        this.renderTemplate();
        this.renderItems();

        // skip this if the initial render scroll position has not yet been set.
        // necessary since IE/Opera must be deferred, so the first refresh will
        // override the initial position by default and always set it to 0.
        if (this.scrollReady) {
            this.scrollTo(top);
        }
    },

    /**
     * Scrolls the container to the specified vertical position. If the view is large enough that
     * there is no scroll overflow then this method will have no effect.
     * @param {Number} y The new vertical scroll position in pixels 
     * @param {Boolean} defer (optional) <p>True to slightly defer the call, false to execute immediately.</p> 
     * <p>This method will automatically defer itself for IE and Opera (even if you pass false) otherwise
     * the scroll position will not update in those browsers. You can optionally pass true, however, to
     * force the defer in all browsers, or use your own custom conditions to determine whether this is needed.</p>
     * <p>Note that this method should not generally need to be called directly as scroll position is managed internally.</p>
     */
    scrollTo: function(y, defer) {
        defer = defer || (Ext.isIE || Ext.isOpera);
        if (defer) {
            Ext.defer(function() {
                this.el.scrollTo('top', y, true);
                this.scrollReady = true;
            }, 10, this);
        }
        else {
            this.el.scrollTo('top', y, true);
            this.scrollReady = true;
        }
    },

    // private
    afterRender: function() {
        if (!this.tpl) {
            this.tpl = new Ext.calendar.template.DayBody({
                id: this.id,
                dayCount: this.dayCount,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime
            });
        }
        this.tpl.compile();

        this.addCls('ext-cal-body-ct');

        this.callParent(arguments);

        // default scroll position to 7am:
        this.scrollTo(7 * 42);
    },

    // private
    forceSize: Ext.emptyFn,

    // private
    onEventResize: function(rec, data) {
        var D = Ext.calendar.util.Date,
        start = Ext.calendar.data.EventMappings.StartDate.name,
        end = Ext.calendar.data.EventMappings.EndDate.name;

        if (D.compare(rec.data[start], data.StartDate) === 0 &&
        D.compare(rec.data[end], data.EndDate) === 0) {
            // no changes
            return;
        }
        rec.set(start, data.StartDate);
        rec.set(end, data.EndDate);

        this.fireEvent('eventresize', this, rec);
    },

    // inherited docs
    getEventBodyMarkup: function() {
        if (!this.eventBodyMarkup) {
            this.eventBodyMarkup = ['{Title}',
            '<tpl if="_isReminder">',
            '<i class="ext-cal-ic ext-cal-ic-rem">&#160;</i>',
            '</tpl>',
            '<tpl if="_isRecurring">',
            '<i class="ext-cal-ic ext-cal-ic-rcr">&#160;</i>',
            '</tpl>'
            //                '<tpl if="spanLeft">',
            //                    '<i class="ext-cal-spl">&#160;</i>',
            //                '</tpl>',
            //                '<tpl if="spanRight">',
            //                    '<i class="ext-cal-spr">&#160;</i>',
            //                '</tpl>'
            ].join('');
        }
        return this.eventBodyMarkup;
    },

    // inherited docs
    getEventTemplate: function() {
        if (!this.eventTpl) {
            this.eventTpl = !(Ext.isIE || Ext.isOpera) ?
            new Ext.XTemplate(
                '<div id="{_elId}" class="{_selectorCls} {_colorCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
                '<div class="ext-evt-bd">', this.getEventBodyMarkup(), '</div>',
                '<div class="ext-evt-rsz"><div class="ext-evt-rsz-h">&#160;</div></div>',
                '</div>'
            )
            : new Ext.XTemplate(
                '<div id="{_elId}" class="ext-cal-evt {_selectorCls} {_colorCls}-x" style="left: {_left}%; width: {_width}%; top: {_top}px;">',
                '<div class="ext-cal-evb">&#160;</div>',
                '<dl style="height: {_height}px;" class="ext-cal-evdm">',
                '<dd class="ext-evt-bd">',
                this.getEventBodyMarkup(),
                '</dd>',
                '<div class="ext-evt-rsz"><div class="ext-evt-rsz-h">&#160;</div></div>',
                '</dl>',
                '<div class="ext-cal-evb">&#160;</div>',
                '</div>'
            );
            this.eventTpl.compile();
        }
        return this.eventTpl;
    },

    /**
     * <p>Returns the XTemplate that is bound to the calendar's event store (it expects records of type
     * {@link Ext.calendar.EventRecord}) to populate the calendar views with <strong>all-day</strong> events. 
     * Internally this method by default generates different markup for browsers that support CSS border radius 
     * and those that don't. This method can be overridden as needed to customize the markup generated.</p>
     * <p>Note that this method calls {@link #getEventBodyMarkup} to retrieve the body markup for events separately
     * from the surrounding container markup.  This provdes the flexibility to customize what's in the body without
     * having to override the entire XTemplate. If you do override this method, you should make sure that your 
     * overridden version also does the same.</p>
     * @return {Ext.XTemplate} The event XTemplate
     */
    getEventAllDayTemplate: function() {
        if (!this.eventAllDayTpl) {
            var tpl,
            body = this.getEventBodyMarkup();

            tpl = !(Ext.isIE || Ext.isOpera) ?
            new Ext.XTemplate(
                '<div id="{_elId}" class="{_selectorCls} {_colorCls} {spanCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
                body,
                '</div>'
            )
            : new Ext.XTemplate(
                '<div id="{_elId}" class="ext-cal-evt" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px;">',
                '<div class="{_selectorCls} {spanCls} {_colorCls} ext-cal-evo">',
                '<div class="ext-cal-evm">',
                '<div class="ext-cal-evi">',
                body,
                '</div>',
                '</div>',
                '</div></div>'
            );
            tpl.compile();
            this.eventAllDayTpl = tpl;
        }
        return this.eventAllDayTpl;
    },

    // private
    getTemplateEventData: function(evt) {
        var selector = this.getEventSelectorCls(evt[Ext.calendar.data.EventMappings.EventId.name]),
            data = {},
            M = Ext.calendar.data.EventMappings;

        this.getTemplateEventBox(evt);

        data._selectorCls = selector;
        data._colorCls = 'ext-color-' + (evt[M.CalendarId.name] || '0') + (evt._renderAsAllDay ? '-ad': '');
        data._elId = selector + (evt._weekIndex ? '-' + evt._weekIndex: '');
        data._isRecurring = evt.Recurrence && evt.Recurrence != '';
        data._isReminder = evt[M.Reminder.name] && evt[M.Reminder.name] != '';
        var title = evt[M.Title.name];
        data.Title = (evt[M.IsAllDay.name] ? '': Ext.Date.format(evt[M.StartDate.name], 'g:ia ')) + (!title || title.length == 0 ? '(No title)': title);

        return Ext.applyIf(data, evt);
    },

    // private
    getTemplateEventBox: function(evt) {
        var heightFactor = 0.7,
            start = evt[Ext.calendar.data.EventMappings.StartDate.name],
            end = evt[Ext.calendar.data.EventMappings.EndDate.name],
            startMins = start.getHours() * 60 + start.getMinutes(),
            endMins = end.getHours() * 60 + end.getMinutes(),
            diffMins = endMins - startMins;

        evt._left = 0;
        evt._width = 100;
        evt._top = Math.round(startMins * heightFactor);
        evt._height = Math.max((diffMins * heightFactor), 15);
    },

    // private
    renderItems: function() {
        var day = 0,
            evts = [],
            ev,
            d,
            ct,
            item,
            i,
            j,
            l,
            emptyCells, skipped,
            evt,
            evt2,
            overlapCols,
            prevCol,
            colWidth,
            evtWidth,
            markup,
            target;
        for (; day < this.dayCount; day++) {
            ev = emptyCells = skipped = 0;
            d = this.eventGrid[0][day];
            ct = d ? d.length: 0;

            for (; ev < ct; ev++) {
                evt = d[ev];
                if (!evt) {
                    continue;
                }
                item = evt.data || evt.event.data;
                if (item._renderAsAllDay) {
                    continue;
                }
                Ext.apply(item, {
                    cls: 'ext-cal-ev',
                    _positioned: true
                });
                evts.push({
                    data: this.getTemplateEventData(item),
                    date: Ext.calendar.util.Date.add(this.viewStart, {days: day})
                });
            }
        }

        // overlapping event pre-processing loop
        i = j = overlapCols = prevCol = 0;
        l = evts.length;
        for (; i < l; i++) {
            evt = evts[i].data;
            evt2 = null;
            prevCol = overlapCols;
            for (j = 0; j < l; j++) {
                if (i == j) {
                    continue;
                }
                evt2 = evts[j].data;
                if (this.isOverlapping(evt, evt2)) {
                    evt._overlap = evt._overlap == undefined ? 1: evt._overlap + 1;
                    if (i < j) {
                        if (evt._overcol === undefined) {
                            evt._overcol = 0;
                        }
                        evt2._overcol = evt._overcol + 1;
                        overlapCols = Math.max(overlapCols, evt2._overcol);
                    }
                }
            }
        }

        // rendering loop
        for (i = 0; i < l; i++) {
            evt = evts[i].data;
            if (evt._overlap !== undefined) {
                colWidth = 100 / (overlapCols + 1);
                evtWidth = 100 - (colWidth * evt._overlap);

                evt._width = colWidth;
                evt._left = colWidth * evt._overcol;
            }
            markup = this.getEventTemplate().apply(evt);
            target = this.id + '-day-col-' + Ext.Date.format(evts[i].date, 'Ymd');
            Ext.get(target).select('*').destroy();

            Ext.core.DomHelper.append(target, markup);
        }

        this.fireEvent('eventsrendered', this);
    },

    // private
    getDayEl: function(dt) {
        return Ext.get(this.getDayId(dt));
    },

    // private
    getDayId: function(dt) {
        if (Ext.isDate(dt)) {
            dt = Ext.Date.format(dt, 'Ymd');
        }
        return this.id + this.dayColumnElIdDelimiter + dt;
    },

    // private
    getDaySize: function() {
        var box = this.el.down('.ext-cal-day-col-inner').getBox();
        return {
            height: box.height,
            width: box.width
        };
    },

    // private
    getDayAt: function(x, y) {
        var xoffset = this.el.down('.ext-cal-day-times').getWidth(),
            viewBox = this.el.getBox(),
            daySize = this.getDaySize(false),
            relX = x - viewBox.x - xoffset,
            dayIndex = Math.floor(relX / daySize.width),
            // clicked col index
            scroll = this.el.getScroll(),
            row = this.el.down('.ext-cal-bg-row'),
            // first avail row, just to calc size
            rowH = row.getHeight() / 2,
            // 30 minute increment since a row is 60 minutes
            relY = y - viewBox.y - rowH + scroll.top,
            rowIndex = Math.max(0, Math.ceil(relY / rowH)),
            mins = rowIndex * 30,
            dt = Ext.calendar.util.Date.add(this.viewStart, {days: dayIndex, minutes: mins}),
            el = this.getDayEl(dt),
            timeX = x;

        if (el) {
            timeX = el.getX();
        }

        return {
            date: dt,
            el: el,
            // this is the box for the specific time block in the day that was clicked on:
            timeBox: {
                x: timeX,
                y: (rowIndex * 21) + viewBox.y - scroll.top,
                width: daySize.width,
                height: rowH
            }
        };
    },

    // private
    onClick: function(e, t) {
        if (this.dragPending || Ext.calendar.view.DayBody.superclass.onClick.apply(this, arguments)) {
            // The superclass handled the click already so exit
            return;
        }
        if (e.getTarget('.ext-cal-day-times', 3) !== null) {
            // ignore clicks on the times-of-day gutter
            return;
        }
        var el = e.getTarget('td', 3);
        if (el) {
            if (el.id && el.id.indexOf(this.dayElIdDelimiter) > -1) {
                var dt = this.getDateFromId(el.id, this.dayElIdDelimiter);
                this.fireEvent('dayclick', this, Ext.Date.parseDate(dt, 'Ymd'), true, Ext.get(this.getDayId(dt, true)));
                return;
            }
        }
        var day = this.getDayAt(e.getX(), e.getY());
        if (day && day.date) {
            this.fireEvent('dayclick', this, day.date, false, null);
        }
    }
});




/* ----- /calendar/src/data/CalendarMappings.js ----- */

//@define Ext.calendar.data.CalendarMappings

/**
 * @class Ext.calendar.data.CalendarMappings
 * A simple object that provides the field definitions for Calendar records so that they can be easily overridden.
 *
 * To ensure the proper definition of Ext.calendar.data.EventModel the override should be
 * written like this:
 *
 *      Ext.define('MyApp.data.CalendarMappings', {
 *          override: 'Ext.calendar.data.CalendarMappings'
 *      },
 *      function () {
 *          // Update "this" (this === Ext.calendar.data.CalendarMappings)
 *      });
 */
Ext.ns('Ext.calendar.data');

Ext.calendar.data.CalendarMappings = {
    CalendarId: {
        name:    'CalendarId',
        mapping: 'id',
        type:    'int'
    },
    Title: {
        name:    'Title',
        mapping: 'title',
        type:    'string'
    },
    Description: {
        name:    'Description', 
        mapping: 'desc',   
        type:    'string' 
    },
    ColorId: {
        name:    'ColorId',
        mapping: 'color',
        type:    'int'
    },
    IsHidden: {
        name:    'IsHidden',
        mapping: 'hidden',
        type:    'boolean'
    }
};




/* ----- /calendar/src/view/DayHeader.js ----- */

/**
 * @class Ext.calendar.view.DayHeader
 * @extends Ext.calendar.MonthView
 * <p>This is the header area container within the day and week views where all-day events are displayed.
 * Normally you should not need to use this class directly -- instead you should use {@link Ext.calendar.DayView DayView}
 * which aggregates this class and the {@link Ext.calendar.DayBodyView DayBodyView} into the single unified view
 * presented by {@link Ext.calendar.CalendarPanel CalendarPanel}.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.view.DayHeader', {
    extend: 'Ext.calendar.view.Month',
    alias: 'widget.dayheaderview',

    requires: [
        'Ext.calendar.template.DayHeader'
    ],
    
    // private configs
    weekCount: 1,
    dayCount: 1,
    allDayOnly: true,
    monitorResize: false,

    /**
     * @event dayclick
     * Fires after the user clicks within the day view container and not on an event element
     * @param {Ext.calendar.DayBodyView} this
     * @param {Date} dt The date/time that was clicked on
     * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
     * DayHeaderView always return true for this param.
     * @param {Ext.core.Element} el The Element that was clicked on
     */

    // private
    afterRender: function() {
        if (!this.tpl) {
            this.tpl = new Ext.calendar.template.DayHeader({
                id: this.id,
                showTodayText: this.showTodayText,
                todayText: this.todayText,
                showTime: this.showTime
            });
        }
        this.tpl.compile();
        this.addCls('ext-cal-day-header');

        this.callParent(arguments);
    },

    // private
    forceSize: Ext.emptyFn,

    // private
    refresh: function() {
        this.callParent(arguments);
        this.recalcHeaderBox();
    },

    // private
    recalcHeaderBox : function(){
        var tbl = this.el.down('.ext-cal-evt-tbl'),
            h = tbl.getHeight();
        
        this.el.setHeight(h+7);
        
        // These should be auto-height, but since that does not work reliably
        // across browser / doc type, we have to size them manually
        this.el.down('.ext-cal-hd-ad-inner').setHeight(h+5);
        this.el.down('.ext-cal-bg-tbl').setHeight(h+5);
    },

    // private
    moveNext: function(noRefresh) {
        return this.moveDays(this.dayCount, noRefresh);
    },

    // private
    movePrev: function(noRefresh) {
        return this.moveDays( - this.dayCount, noRefresh);
    },

    // private
    onClick: function(e, t) {
        var el = e.getTarget('td', 3),
            parts,
            dt;
        if (el) {
            if (el.id && el.id.indexOf(this.dayElIdDelimiter) > -1) {
                parts = el.id.split(this.dayElIdDelimiter);
                dt = parts[parts.length - 1];

                this.fireEvent('dayclick', this, Ext.Date.parseDate(dt, 'Ymd'), true, Ext.get(this.getDayId(dt)));
                return;
            }
        }
        this.callParent(arguments);
    }
});




/* ----- /calendar/src/form/field/ReminderCombo.js ----- */

/**
 * @class Ext.calendar.form.field.ReminderCombo
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing a reminder setting for an event.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
    width: 200,
    fieldLabel: 'Reminder',
    queryMode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'desc',
    valueField: 'value'
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.form.field.ReminderCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.reminderfield',

    fieldLabel: 'Reminder',
    queryMode: 'local',
    triggerAction: 'all',
    forceSelection: true,
    displayField: 'desc',
    valueField: 'value',

    // private
    initComponent: function() {
        this.store = this.store || new Ext.data.ArrayStore({
            fields: ['value', 'desc'],
            idIndex: 0,
            data: [
            ['', 'None'],
            ['0', 'At start time'],
            ['5', '5 minutes before start'],
            ['15', '15 minutes before start'],
            ['30', '30 minutes before start'],
            ['60', '1 hour before start'],
            ['90', '1.5 hours before start'],
            ['120', '2 hours before start'],
            ['180', '3 hours before start'],
            ['360', '6 hours before start'],
            ['720', '12 hours before start'],
            ['1440', '1 day before start'],
            ['2880', '2 days before start'],
            ['4320', '3 days before start'],
            ['5760', '4 days before start'],
            ['7200', '5 days before start'],
            ['10080', '1 week before start'],
            ['20160', '2 weeks before start']
            ]
        });

        this.callParent();
    },

    // inherited docs
    initValue: function() {
        if (this.value !== undefined) {
            this.setValue(this.value);
        }
        else {
            this.setValue('');
        }
        this.originalValue = this.getValue();
    }
});




/* ----- /calendar/src/form/field/CalendarCombo.js ----- */

/**
 * @class Ext.calendar.form.field.CalendarCombo
 * @extends Ext.form.ComboBox
 * <p>A custom combo used for choosing from the list of available calendars to assign an event to.</p>
 * <p>This is pretty much a standard combo that is simply pre-configured for the options needed by the
 * calendar components. The default configs are as follows:<pre><code>
    fieldLabel: 'Calendar',
    triggerAction: 'all',
    queryMode: 'local',
    forceSelection: true,
    selectOnFocus: true,
    width: 200
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.form.field.CalendarCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.calendarpicker',
    requires: [
        'Ext.calendar.data.CalendarMappings'
    ],

    fieldLabel: 'Calendar',
    triggerAction: 'all',
    queryMode: 'local',
    forceSelection: true,
    selectOnFocus: true,
    
    // private
    defaultCls: 'ext-color-default',

    // private
    initComponent: function(){
        this.valueField = Ext.calendar.data.CalendarMappings.CalendarId.name;
        this.displayField = Ext.calendar.data.CalendarMappings.Title.name;
    
        this.listConfig = Ext.apply(this.listConfig || {}, {
            getInnerTpl: this.getListItemTpl
        });
        
        this.callParent(arguments);
    },
    
    // private
    getListItemTpl: function(displayField) {
        return '<div class="x-combo-list-item ext-color-{' + Ext.calendar.data.CalendarMappings.CalendarId.name +
                '}"><div class="ext-cal-picker-icon">&#160;</div>{' + displayField + '}</div>';
    },
    
    // private
    afterRender: function(){
        this.callParent(arguments);
        
        this.wrap = this.el.down('.x-form-text-wrap');
        this.wrap.addCls('ext-calendar-picker');
        
        this.icon = Ext.core.DomHelper.append(this.wrap, {
            tag: 'div', cls: 'ext-cal-picker-icon ext-cal-picker-mainicon'
        });
    },
    
    /* @private
     * Value can be a data value or record, or an array of values or records.
     */
    getStyleClass: function(value){
        var val = value;
        
        if (!Ext.isEmpty(val)) {
            if (Ext.isArray(val)) {
                val = val[0];
            }
            return 'ext-color-' + (val.data ? val.data[Ext.calendar.data.CalendarMappings.CalendarId.name] : val); 
        }
        return '';
    },
    
    // inherited docs
    setValue: function(value) {
        if (!value && this.store.getCount() > 0) {
            // ensure that a valid value is always set if possible
            value = this.store.getAt(0).data[Ext.calendar.data.CalendarMappings.CalendarId.name];
        }
        
        if (this.wrap && value) {
            var currentClass = this.getStyleClass(this.getValue()),
                newClass = this.getStyleClass(value);
            
            this.wrap.replaceCls(currentClass, newClass);
        }
        
        this.callParent(arguments);
    }
});



/* ----- /calendar/src/view/Day.js ----- */

/**
 * @class Ext.calendar.view.Day
 * @extends Ext.container.Container
 * <p>Unlike other calendar views, is not actually a subclass of {@link Ext.calendar.view.AbstractCalendar AbstractCalendar}.
 * Instead it is a {@link Ext.container.Container Container} subclass that internally creates and manages the layouts of
 * a {@link Ext.calendar.DayHeaderView DayHeaderView} and a {@link Ext.calendar.DayBodyView DayBodyView}. As such
 * DayView accepts any config values that are valid for DayHeaderView and DayBodyView and passes those through
 * to the contained views. It also supports the interface required of any calendar view and in turn calls methods
 * on the contained views as necessary.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.view.Day', {
    extend: 'Ext.container.Container',
    alias: 'widget.dayview',
    
    requires: [
        'Ext.calendar.view.AbstractCalendar',
        'Ext.calendar.view.DayHeader',
        'Ext.calendar.view.DayBody'
    ],
    
    /**
     * @cfg {Boolean} showTime
     * True to display the current time in today's box in the calendar, false to not display it (defautls to true)
     */
    showTime: true,
    /**
     * @cfg {Boolean} showTodayText
     * True to display the {@link #todayText} string in today's box in the calendar, false to not display it (defautls to true)
     */
    showTodayText: true,
    /**
     * @cfg {String} todayText
     * The text to display in the current day's box in the calendar when {@link #showTodayText} is true (defaults to 'Today')
     */
    todayText: 'Today',
    /**
     * @cfg {String} ddCreateEventText
     * The text to display inside the drag proxy while dragging over the calendar to create a new event (defaults to 
     * 'Create event for {0}' where {0} is a date range supplied by the view)
     */
    ddCreateEventText: 'Create event for {0}',
    /**
     * @cfg {String} ddMoveEventText
     * The text to display inside the drag proxy while dragging an event to reposition it (defaults to 
     * 'Move event to {0}' where {0} is the updated event start date/time supplied by the view)
     */
    ddMoveEventText: 'Move event to {0}',
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 1)
     */
    dayCount: 1,
    
    // private
    initComponent : function(){
        // rendering more than 7 days per view is not supported
        this.dayCount = this.dayCount > 7 ? 7 : this.dayCount;
        
        var cfg = Ext.apply({}, this.initialConfig);
        cfg.showTime = this.showTime;
        cfg.showTodatText = this.showTodayText;
        cfg.todayText = this.todayText;
        cfg.dayCount = this.dayCount;
        cfg.wekkCount = 1; 
        
        var header = Ext.applyIf({
            xtype: 'dayheaderview',
            id: this.id+'-hd'
        }, cfg);
        
        var body = Ext.applyIf({
            xtype: 'daybodyview',
            id: this.id+'-bd'
        }, cfg);
        
        this.items = [header, body];
        this.addCls('ext-cal-dayview ext-cal-ct');
        
        this.callParent(arguments);
    },
    
    // private
    afterRender : function(){
        this.callParent(arguments);
        
        this.header = Ext.getCmp(this.id+'-hd');
        this.body = Ext.getCmp(this.id+'-bd');
        this.body.on('eventsrendered', this.forceSize, this);
    },
    
    // private
    refresh : function(){
        this.header.refresh();
        this.body.refresh();
    },
    
    // private
    forceSize: function(){
        // The defer call is mainly for good ol' IE, but it doesn't hurt in
        // general to make sure that the window resize is good and done first
        // so that we can properly calculate sizes.
        Ext.defer(function(){
            var ct = this.el.up('.x-panel-body'),
                hd = this.el.down('.ext-cal-day-header'),
                h = ct.getHeight() - hd.getHeight();
            
            this.el.down('.ext-cal-body-ct').setHeight(h);
        }, 10, this);
    },
    
    // private
    onResize : function() {
        this.callParent(arguments);
        this.forceSize();
    },
    
    // private
    getViewBounds : function(){
        return this.header.getViewBounds();
    },
    
    /**
     * Returns the start date of the view, as set by {@link #setStartDate}. Note that this may not 
     * be the first date displayed in the rendered calendar -- to get the start and end dates displayed
     * to the user use {@link #getViewBounds}.
     * @return {Date} The start date
     */
    getStartDate : function(){
        return this.header.getStartDate();
    },

    /**
     * Sets the start date used to calculate the view boundaries to display. The displayed view will be the 
     * earliest and latest dates that match the view requirements and contain the date passed to this function.
     * @param {Date} dt The date used to calculate the new view boundaries
     */
    setStartDate: function(dt){
        this.header.setStartDate(dt, true);
        this.body.setStartDate(dt, true);
    },

    // private
    renderItems: function(){
        this.header.renderItems();
        this.body.renderItems();
    },
    
    /**
     * Returns true if the view is currently displaying today's date, else false.
     * @return {Boolean} True or false
     */
    isToday : function(){
        return this.header.isToday();
    },
    
    /**
     * Updates the view to contain the passed date
     * @param {Date} dt The date to display
     * @return {Date} The new view start date
     */
    moveTo : function(dt, noRefresh){
        this.header.moveTo(dt, noRefresh);
        return this.body.moveTo(dt, noRefresh);
    },
    
    /**
     * Updates the view to the next consecutive date(s)
     * @return {Date} The new view start date
     */
    moveNext : function(noRefresh){
        this.header.moveNext(noRefresh);
        return this.body.moveNext(noRefresh);
    },
    
    /**
     * Updates the view to the previous consecutive date(s)
     * @return {Date} The new view start date
     */
    movePrev : function(noRefresh){
        this.header.movePrev(noRefresh);
        return this.body.movePrev(noRefresh);
    },

    /**
     * Shifts the view by the passed number of days relative to the currently set date
     * @param {Number} value The number of days (positive or negative) by which to shift the view
     * @return {Date} The new view start date
     */
    moveDays : function(value, noRefresh){
        this.header.moveDays(value, noRefresh);
        return this.body.moveDays(value, noRefresh);
    },
    
    /**
     * Updates the view to show today
     * @return {Date} Today's date
     */
    moveToday : function(noRefresh){
        this.header.moveToday(noRefresh);
        return this.body.moveToday(noRefresh);
    }
});




/* ----- /calendar/src/form/field/DateRange.js ----- */

/**
 * @class Ext.form.field.DateRange
 * @extends Ext.form.Field
 * <p>A combination field that includes start and end dates and times, as well as an optional all-day checkbox.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.form.field.DateRange', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.daterangefield',
    
    requires: [
        'Ext.form.field.Date',
        'Ext.form.field.Time',
        'Ext.form.Label',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Column'
    ],
    
    /**
     * @cfg {String} toText
     * The text to display in between the date/time fields (defaults to 'to')
     */
    toText: 'to',
    /**
     * @cfg {String} allDayText
     * The text to display as the label for the all day checkbox (defaults to 'All day')
     */
    allDayText: 'All day',
    /**
     * @cfg {String/Boolean} singleLine
     * `true` to render the fields all on one line, `false` to break the start date/time and end date/time
     * into two stacked rows of fields to preserve horizontal space (defaults to `true`).
     */
    singleLine: true,
    /**
     * @cfg {String} dateFormat
     * The date display format used by the date fields (defaults to 'n/j/Y') 
     */
    dateFormat: 'n/j/Y',
    /**
     * @cfg {String} timeFormat
     * The time display format used by the time fields. By default the DateRange uses the
     * {@link Ext.Date.use24HourTime} setting and sets the format to 'g:i A' for 12-hour time (e.g., 1:30 PM) 
     * or 'G:i' for 24-hour time (e.g., 13:30). This can also be overridden by a static format string if desired.
     */
    timeFormat: Ext.Date.use24HourTime ? 'G:i' : 'g:i A',
    
    // private
    fieldLayout: 'hbox',

    defaults: {
        margin: '0 5 0 0'
    },

    // private
    initComponent: function() {
        var me = this;
        
        me.addCls('ext-dt-range');
        
        if (me.singleLine) {
            me.layout = me.fieldLayout;
            me.items = me.getFieldConfigs();
        }
        else {
            me.items = [{
                xtype: 'container',
                layout: me.fieldLayout,
                items: [
                    me.getStartDateConfig(),
                    me.getStartTimeConfig(),
                    me.getDateSeparatorConfig()
                ]
            },{
                xtype: 'container',
                layout: me.fieldLayout,
                items: [
                    me.getEndDateConfig(),
                    me.getEndTimeConfig(),
                    me.getAllDayConfig()
                ]
            }];
        }
        
        me.callParent(arguments);
        me.initRefs();
    },
    
    initRefs: function() {
        var me = this;
        me.startDate = me.down('#' + me.id + '-start-date');
        me.startTime = me.down('#' + me.id + '-start-time');
        me.endTime = me.down('#' + me.id + '-end-time');
        me.endDate = me.down('#' + me.id + '-end-date');
        me.allDay = me.down('#' + me.id + '-allday');
        me.toLabel = me.down('#' + me.id + '-to-label');

        me.startDate.validateOnChange = me.endDate.validateOnChange = false;

        me.startDate.isValid = me.endDate.isValid = function() {
                                    var me = this,
                                        valid = Ext.isDate(me.getValue());
                                    if (!valid) {
                                        me.focus();
                                    }
                                    return valid;
                                 };
    },

    getFieldConfigs: function() {
        var me = this;
        return [
            me.getStartDateConfig(),
            me.getStartTimeConfig(),
            me.getDateSeparatorConfig(),
            me.getEndTimeConfig(),
            me.getEndDateConfig(),
            me.getAllDayConfig()
        ];
    },
    
    getStartDateConfig: function() {
        return {
            xtype: 'datefield',
            itemId: this.id + '-start-date',
            format: this.dateFormat,
            width: 100,
            listeners: {
                'blur': {
                    fn: function(){
                        this.onFieldChange('date', 'start');
                    },
                    scope: this
                }
            }
        };
    },
    
    getStartTimeConfig: function() {
        return {
            xtype: 'timefield',
            itemId: this.id + '-start-time',
            hidden: this.showTimes === false,
            labelWidth: 0,
            hideLabel: true,
            width: 90,
            format: this.timeFormat,
            listeners: {
                'select': {
                    fn: function(){
                        this.onFieldChange('time', 'start');
                    },
                    scope: this
                }
            }
        };
    },
    
    getEndDateConfig: function() {
        return {
            xtype: 'datefield',
            itemId: this.id + '-end-date',
            format: this.dateFormat,
            hideLabel: true,
            width: 100,
            listeners: {
                'blur': {
                    fn: function(){
                        this.onFieldChange('date', 'end');
                    },
                    scope: this
                }
            }
        };
    },
    
    getEndTimeConfig: function() {
        return {
            xtype: 'timefield',
            itemId: this.id + '-end-time',
            hidden: this.showTimes === false,
            labelWidth: 0,
            hideLabel: true,
            width: 90,
            format: this.timeFormat,
            listeners: {
                'select': {
                    fn: function(){
                        this.onFieldChange('time', 'end');
                    },
                    scope: this
                }
            }
        };
    },

    getDuration: function() {
        var me = this,
            start = me.getDT('start'),
            end = me.getDT('end');

        return end.getTime() - start.getTime();
    },
    
    getAllDayConfig: function() {
        return {
            xtype: 'checkbox',
            itemId: this.id + '-allday',
            hidden: this.showTimes === false || this.showAllDay === false,
            boxLabel: this.allDayText,
            margin: '2 5 0 0',
            handler: this.onAllDayChange,
            scope: this
        };
    },
    
    onAllDayChange: function(chk, checked) {
        Ext.suspendLayouts();
        this.startTime.setDisabled(checked).setVisible(!checked);
        this.endTime.setDisabled(checked).setVisible(!checked);
        Ext.resumeLayouts(true);
    },
    
    getDateSeparatorConfig: function() {
        return {
            xtype: 'label',
            itemId: this.id + '-to-label',
            text: this.toText,
            margin: '4 5 0 0'
        };
    },
    
    isSingleLine: function() {
        var me = this;
        
        if (me.calculatedSingleLine === undefined) {
            if(me.singleLine == 'auto'){
                var ownerCtEl = me.ownerCt.getEl(),
                    w = me.ownerCt.getWidth() - ownerCtEl.getPadding('lr'),
                    el = ownerCtEl.down('.x-panel-body');
                    
                if(el){
                    w -= el.getPadding('lr');
                }
                
                el = ownerCtEl.down('.x-form-item-label');
                if(el){
                    w -= el.getWidth() - el.getPadding('lr');
                }
                me.calculatedSingleLine = w <= me.singleLineMinWidth ? false : true;
            }
            else {
                me.calculatedSingleLine = me.singleLine !== undefined ? me.singleLine : true;
            }
        }
        return me.calculatedSingleLine;
    },

    // private
    onFieldChange: function(type, startend){
        this.checkDates(type, startend);
        this.fireEvent('change', this, this.getValue());
    },
        
    // private
    checkDates: function(type, startend){
        var me = this,
            startField = me.down('#' + me.id + '-start-' + type),
            endField = me.down('#' + me.id + '-end-' + type),
            startValue = me.getDT('start'),
            endValue = me.getDT('end');

        if (!startValue || !endValue) {
            return;
        }

        if(startValue > endValue){
            if(startend=='start'){
                endField.setValue(startValue);
            }else{
                startField.setValue(endValue);
                me.checkDates(type, 'start');
            }
        }
        if(type=='date'){
            me.checkDates('time', startend);
        }
    },
    
    /**
     * Returns an array containing the following values in order:<div class="mdetail-params"><ul>
     * <li><b><code>DateTime</code></b> : <div class="sub-desc">The start date/time</div></li>
     * <li><b><code>DateTime</code></b> : <div class="sub-desc">The end date/time</div></li>
     * <li><b><code>Boolean</code></b> : <div class="sub-desc">True if the dates are all-day, false 
     * if the time values should be used</div></li><ul></div>
     * @return {Array} The array of return values
     */
    getValue: function(){
        var eDate = Ext.calendar.util.Date,
            start = this.getDT('start'),
            end = this.getDT('end'),
            allDay = this.allDay.getValue();
        
        if (Ext.isDate(start) && Ext.isDate(end) && start.getTime() !== end.getTime()) {
            if (!allDay && eDate.isMidnight(start) && eDate.isMidnight(end)) {
                // 12:00am -> 12:00am over n days, all day event
                allDay = true;
                end = eDate.add(end, {
                    days: -1
                });
            }
        }
        
        return [
            start, 
            end,
            allDay
        ];
    },
    
    // private getValue helper
    getDT: function(startend){
        var time = this[startend+'Time'].getValue(),
            dt = this[startend+'Date'].getValue();
            
        if(Ext.isDate(dt)){
            dt = Ext.Date.format(dt, this[startend + 'Date'].format);
        }
        else{
            return null;
        }
        if(time && time !== ''){
            time = Ext.Date.format(time, this[startend+'Time'].format);
            var val = Ext.Date.parseDate(dt + ' ' + time, this[startend+'Date'].format + ' ' + this[startend+'Time'].format);
            return val;
            //return Ext.Date.parseDate(dt+' '+time, this[startend+'Date'].format+' '+this[startend+'Time'].format);
        }
        return Ext.Date.parseDate(dt, this[startend+'Date'].format);
        
    },
    
    /**
     * Sets the values to use in the date range.
     * @param {Array/Date/Object} v The value(s) to set into the field. Valid types are as follows:<div class="mdetail-params"><ul>
     * <li><b><code>Array</code></b> : <div class="sub-desc">An array containing, in order, a start date, end date and all-day flag.
     * This array should exactly match the return type as specified by {@link #getValue}.</div></li>
     * <li><b><code>DateTime</code></b> : <div class="sub-desc">A single Date object, which will be used for both the start and
     * end dates in the range.  The all-day flag will be defaulted to false.</div></li>
     * <li><b><code>Object</code></b> : <div class="sub-desc">An object containing properties for StartDate, EndDate and IsAllDay
     * as defined in {@link Ext.calendar.data.EventMappings}.</div></li><ul></div>
     */
    setValue: function(v){
        if(!v) {
            return;
        }
        if(Ext.isArray(v)){
            this.setDT(v[0], 'start');
            this.setDT(v[1], 'end');
            this.allDay.setValue(!!v[2]);
        }
        else if(Ext.isDate(v)){
            this.setDT(v, 'start');
            this.setDT(v, 'end');
            this.allDay.setValue(false);
        }
        else if(v[Ext.calendar.data.EventMappings.StartDate.name]){ //object
            this.setDT(v[Ext.calendar.data.EventMappings.StartDate.name], 'start');
            if(!this.setDT(v[Ext.calendar.data.EventMappings.EndDate.name], 'end')){
                this.setDT(v[Ext.calendar.data.EventMappings.StartDate.name], 'end');
            }
            this.allDay.setValue(!!v[Ext.calendar.data.EventMappings.IsAllDay.name]);
        }
    },
    
    // private setValue helper
    setDT: function(dt, startend){
        if(dt && Ext.isDate(dt)){
            this[startend + 'Date'].setValue(dt);
            this[startend + 'Time'].setValue(Ext.Date.format(dt, this[startend + 'Time'].format));
            return true;
        }
    },
    
    // inherited docs
    isDirty: function(){
        var dirty = false;
        if(this.rendered && !this.disabled) {
            this.items.each(function(item){
                if (item.isDirty()) {
                    dirty = true;
                    return false;
                }
            });
        }
        return dirty;
    },
    
    // private
    onDisable : function(){
        this.delegateFn('disable');
    },
    
    // private
    onEnable : function(){
        this.delegateFn('enable');
    },
    
    // inherited docs
    reset : function(){
        this.delegateFn('reset');
    },
    
    // private
    delegateFn : function(fn){
        this.items.each(function(item){
            if (item[fn]) {
                item[fn]();
            }
        });
    },
    
    // private
    beforeDestroy: function(){
        Ext.destroy(this.fieldCt);
        this.callParent(arguments);
    },
    
    /**
     * @method getRawValue
     * @hide
     */
    getRawValue : Ext.emptyFn,
    /**
     * @method setRawValue
     * @hide
     */
    setRawValue : Ext.emptyFn
});



/* ----- /calendar/src/form/EventDetails.js ----- */

/**
 * @class Ext.calendar.form.EventDetails
 * @extends Ext.form.Panel
 * <p>A custom form used for detailed editing of events.</p>
 * <p>This is pretty much a standard form that is simply pre-configured for the options needed by the
 * calendar components. It is also configured to automatically bind records of type {@link Ext.calendar.EventRecord}
 * to and from the form.</p>
 * <p>This form also provides custom events specific to the calendar so that other calendar components can be easily
 * notified when an event has been edited via this component.</p>
 * <p>The default configs are as follows:</p><pre><code>
    fieldDefaults: {
        msgTarget: 'side',
        labelWidth: 65
    },
    title: 'Event Form',
    titleTextAdd: 'Add Event',
    titleTextEdit: 'Edit Event',
    bodyStyle: 'background:transparent;padding:20px 20px 10px;',
    border: false,
    buttonAlign: 'center',
    autoHeight: true,
    cls: 'ext-evt-edit-form',
</code></pre>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.form.EventDetails', {
    extend: 'Ext.form.Panel',
    alias: 'widget.eventeditform',
    
    requires: [
        'Ext.calendar.form.field.DateRange',
        'Ext.calendar.form.field.ReminderCombo',
        'Ext.calendar.data.EventMappings',
        'Ext.calendar.form.field.CalendarCombo'
    ],
    
    fieldDefaults: {
        msgTarget: 'side',
        labelWidth: 65
    },
    title: 'Event Form',
    titleTextAdd: 'Add Event',
    titleTextEdit: 'Edit Event',
    bodyStyle: 'background:transparent;padding:20px 20px 10px;',
    border: false,
    buttonAlign: 'center',
    autoHeight: true,
    // to allow for the notes field to autogrow
    cls: 'ext-evt-edit-form',

    // private properties:
    newId: 10000,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    /**
     * @event eventadd
     * Fires after a new event is added
     * @param {Ext.calendar.form.EventDetails} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was added
     */

    /**
     * @event eventupdate
     * Fires after an existing event is updated
     * @param {Ext.calendar.form.EventDetails} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was updated
     */

    /**
     * @event eventdelete
     * Fires after an event is deleted
     * @param {Ext.calendar.form.EventDetails} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was deleted
     */

    /**
     * @event eventcancel
     * Fires after an event add/edit operation is canceled by the user and no store update took place
     * @param {Ext.calendar.form.EventDetails} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was canceled
     */

    // private
    initComponent: function() {
        this.titleField = new Ext.form.Text({
            fieldLabel: 'Title',
            name: Ext.calendar.data.EventMappings.Title.name,
            emptyText: 'Event Title',
            allowBlank: false,
            anchor: '90%'
        });
        this.dateRangeField = new Ext.calendar.form.field.DateRange({
            fieldLabel: 'When',
            singleLine: false,
            anchor: '90%'
        });
        this.reminderField = new Ext.calendar.form.field.ReminderCombo({
            name: 'Reminder',
            anchor: '70%'
        });
        this.notesField = new Ext.form.TextArea({
            fieldLabel: 'Notes',
            name: Ext.calendar.data.EventMappings.Notes.name,
            grow: true,
            growMax: 150,
            anchor: '100%'
        });
        this.locationField = new Ext.form.Text({
            fieldLabel: 'Location',
            name: Ext.calendar.data.EventMappings.Location.name,
            anchor: '100%'
        });
        this.urlField = new Ext.form.Text({
            fieldLabel: 'Web Link',
            name: Ext.calendar.data.EventMappings.Url.name,
            anchor: '100%'
        });

        var leftFields = [this.titleField, this.dateRangeField, this.reminderField],
        rightFields = [this.notesField, this.locationField, this.urlField];

        if (this.calendarStore) {
            this.calendarField = new Ext.calendar.form.field.CalendarCombo({
                store: this.calendarStore,
                anchor: '70%',
                name: Ext.calendar.data.EventMappings.CalendarId.name
            });
            leftFields.splice(2, 0, this.calendarField);
        }

        this.items = [{
            id: 'left-col',
            flex: 0.65,
            layout: 'anchor',
            border: false,
            items: leftFields
        },
        {
            id: 'right-col',
            flex: 0.35,
            layout: 'anchor',
            border: false,
            items: rightFields
        }];

        this.fbar = [{
            cls: 'ext-del-btn',
            itemId: this.id+'-del-btn',
            text: 'Delete Event',
            scope: this,
            handler: this.onDelete,
            minWidth: 150
        },
        {
            text: 'Save',
            scope: this,
            handler: this.onSave
        },
        {
            text: 'Cancel',
            scope: this,
            handler: this.onCancel
        }];

        this.callParent(arguments);
    },

    // inherited docs
    loadRecord: function(rec){
        this.form.reset().loadRecord.apply(this.form, arguments);
        this.activeRecord = rec;
        this.dateRangeField.setValue(rec.data);
        
        if(this.calendarStore){
            this.form.setValues({
                'calendar': rec.data[Ext.calendar.data.EventMappings.CalendarId.name]
            });
        }
        
        if (rec.phantom) {
            this.setTitle(this.titleTextAdd);
            this.down('#' + this.id + '-del-btn').hide();
        }
        else {
            this.setTitle(this.titleTextEdit);
            this.down('#' + this.id + '-del-btn').show();
        }
        this.titleField.focus();
    },
    
    // inherited docs
    updateRecord: function(){
        var dates = this.dateRangeField.getValue(),
            M = Ext.calendar.data.EventMappings,
            rec = this.activeRecord,
            fs = rec.fields,
            dirty = false;
            
        rec.beginEdit();
        
        //TODO: This block is copied directly from BasicForm.updateRecord.
        // Unfortunately since that method internally calls begin/endEdit all
        // updates happen and the record dirty status is reset internally to
        // that call. We need the dirty status, plus currently the DateRangeField
        // does not map directly to the record values, so for now we'll duplicate
        // the setter logic here (we need to be able to pick up any custom-added 
        // fields generically). Need to revisit this later and come up with a better solution.
        Ext.Array.each(fs, function(f){
            var field = this.form.findField(f.name);
            if(field){
                var value = field.getValue();
                if (value.getGroupValue) {
                    value = value.getGroupValue();
                } 
                else if (field.eachItem) {
                    value = [];
                    field.eachItem(function(item){
                        value.push(item.getValue());
                    });
                }
                rec.set(f.name, value);
            }
        }, this);
        
        rec.set(M.StartDate.name, dates[0]);
        rec.set(M.EndDate.name, dates[1]);
        rec.set(M.IsAllDay.name, dates[2]);
        
        dirty = rec.dirty;
        rec.endEdit();
        
        return dirty;
    },

    setStartDate: function(d) {
        var me = this,
            duration = me.dateRangeField.getDuration();

        me.dateRangeField.setDT(d, 'start');

        // Set the end time to keep the duration the same
        me.dateRangeField.setDT(new Date(me.dateRangeField.getDT('start').getTime() + duration), 'end');
    },

    setEndDate: function(d) {
        this.dateRangeField.setDT(d, 'end');
    },

    // private
    onCancel: function() {
        this.cleanup(true);
        this.fireEvent('eventcancel', this, this.activeRecord);
    },

    // private
    cleanup: function(hide) {
        if (this.activeRecord && this.activeRecord.dirty) {
            this.activeRecord.reject();
        }
        delete this.activeRecord;

        if (this.form.isDirty()) {
            this.form.reset();
        }
    },

    // private
    onSave: function(){
        if(!this.form.isValid()){
            return;
        }
        if(!this.updateRecord()){
            this.onCancel();
            return;
        }
        this.fireEvent(this.activeRecord.phantom ? 'eventadd' : 'eventupdate', this, this.activeRecord);
    },

    // private
    onDelete: function() {
        this.fireEvent('eventdelete', this, this.activeRecord);
    }
});




/* ----- /calendar/src/data/CalendarModel.js ----- */

Ext.define('Ext.calendar.data.CalendarModel', {
    extend: 'Ext.data.Model',
    
    requires: [
        'Ext.calendar.data.CalendarMappings'
    ],
    
    identifier: 'sequential',
    
    statics: {
        /**
         * Reconfigures the default record definition based on the current {@link Ext.calendar.data.CalendarMappings CalendarMappings}
         * object. See the header documentation for {@link Ext.calendar.data.CalendarMappings} for complete details and 
         * examples of reconfiguring a CalendarRecord.
         *
         * **NOTE**: Calling this method will *not* update derived class fields. To ensure
         * updates are made before derived classes are defined as an override. See the
         * documentation of `Ext.calendar.data.CalendarMappings`.
         *
         * @static
         * @return {Class} The updated CalendarModel
         */
        reconfigure: function(){
            var me = this,
                Mappings = Ext.calendar.data.CalendarMappings;

            // It is critical that the id property mapping is updated in case it changed, since it
            // is used elsewhere in the data package to match records on CRUD actions:
            me.prototype.idProperty = Mappings.CalendarId.name || 'id';

            me.replaceFields(Ext.Object.getValues(Mappings), true);

            return me;
        }
    }
},
function() {
    this.reconfigure();
});




/* ----- /calendar/src/view/Week.js ----- */

/**
 * @class Ext.calendar.view.Week
 * @extends Ext.calendar.DayView
 * <p>Displays a calendar view by week. This class does not usually need ot be used directly as you can
 * use a {@link Ext.calendar.CalendarPanel CalendarPanel} to manage multiple calendar views at once including
 * the week view.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.view.Week', {
    extend: 'Ext.calendar.view.Day',
    alias: 'widget.weekview',
    
    /**
     * @cfg {Number} dayCount
     * The number of days to display in the view (defaults to 7)
     */
    dayCount: 7
});




/* ----- /calendar/src/data/EventModel.js ----- */

/**
 * This is the {@link Ext.data.Record Record} specification for calendar event data used by the
 * {@link Ext.calendar.CalendarPanel CalendarPanel}'s underlying store. It can be overridden as 
 * necessary to customize the fields supported by events, although the existing column names should
 * not be altered. If your model fields are named differently you should update the <b>mapping</b>
 * configs accordingly.
 *
 * The only required fields when creating a new event record instance are StartDate and
 * EndDate.  All other fields are either optional are will be defaulted if blank.
 *
 * Here is a basic example for how to create a new record of this type:
 *
 *      rec = new Ext.calendar.data.EventModel({
 *          StartDate: '2101-01-12 12:00:00',
 *          EndDate: '2101-01-12 13:30:00',
 *          Title: 'My cool event',
 *          Notes: 'Some notes'
 *      });
 *
 * If you have overridden any of the record's data mappings via the Ext.calendar.data.EventMappings object
 * you may need to set the values using this alternate syntax to ensure that the fields match up correctly:
 *
 *      var M = Ext.calendar.data.EventMappings;
 *
 *      rec = new Ext.calendar.data.EventModel();
 *      rec.data[M.StartDate.name] = '2101-01-12 12:00:00';
 *      rec.data[M.EndDate.name] = '2101-01-12 13:30:00';
 *      rec.data[M.Title.name] = 'My cool event';
 *      rec.data[M.Notes.name] = 'Some notes';
 */
Ext.define('Ext.calendar.data.EventModel', {
    extend: 'Ext.data.Model',
    
    requires: [
        'Ext.calendar.data.EventMappings'
    ],
    
    identifier: 'sequential',
    
    statics: {
        /**
         * Reconfigures the default record definition based on the current {@link Ext.calendar.data.EventMappings EventMappings}
         * object. See the header documentation for {@link Ext.calendar.data.EventMappings} for complete details and 
         * examples of reconfiguring an EventRecord.
         *
         * **NOTE**: Calling this method will *not* update derived class fields. To ensure
         * updates are made before derived classes are defined as an override. See the
         * documentation of `Ext.calendar.data.EventMappings`.
         *
         * @static
         * @return {Class} The updated EventModel
         */
        reconfigure: function() {
            var me = this,
                Mappings = Ext.calendar.data.EventMappings;

            // It is critical that the id property mapping is updated in case it changed, since it
            // is used elsewhere in the data package to match records on CRUD actions:
            me.prototype.idProperty = Mappings.EventId.name || 'id';

            me.replaceFields(Ext.Object.getValues(Mappings), true);

            return me;
        }
    }
},
function(){
    this.reconfigure();
});




/* ----- /calendar/src/data/Events.js ----- */

Ext.define('Ext.calendar.data.Events', {

    statics: {
        getData: function() {
            var today = Ext.Date.clearTime(new Date()), 
                makeDate = function(d, h, m, s) {
                    d = d * 86400;
                    h = (h || 0) * 3600;
                    m = (m || 0) * 60;
                    s = (s || 0);
                    return Ext.Date.add(today, Ext.Date.SECOND, d + h + m + s);
                };
                
            return {
                "evts": [{
                    "id": 1001,
                    "cid": 1,
                    "title": "Vacation",
                    "start": makeDate(-20, 10),
                    "end": makeDate(-10, 15),
                    "notes": "Have fun"
                }, {
                    "id": 1002,
                    "cid": 2,
                    "title": "Lunch with Matt",
                    "start": makeDate(0, 11, 30),
                    "end": makeDate(0, 13),
                    "loc": "Chuy's!",
                    "url": "http://chuys.com",
                    "notes": "Order the queso",
                    "rem": "15"
                }, {
                    "id": 1003,
                    "cid": 3,
                    "title": "Project due",
                    "start": makeDate(0, 15),
                    "end": makeDate(0, 15)
                }, {
                    "id": 1004,
                    "cid": 1,
                    "title": "Sarah's birthday",
                    "start": today,
                    "end": today,
                    "notes": "Need to get a gift",
                    "ad": true
                }, {
                    "id": 1005,
                    "cid": 2,
                    "title": "A long one...",
                    "start": makeDate(-12),
                    "end": makeDate(10, 0, 0, -1),
                    "ad": true
                }, {
                    "id": 1006,
                    "cid": 3,
                    "title": "School holiday",
                    "start": makeDate(5),
                    "end": makeDate(7, 0, 0, -1),
                    "ad": true,
                    "rem": "2880"
                }, {
                    "id": 1007,
                    "cid": 1,
                    "title": "Haircut",
                    "start": makeDate(0, 9),
                    "end": makeDate(0, 9, 30),
                    "notes": "Get cash on the way"
                }, {
                    "id": 1008,
                    "cid": 3,
                    "title": "An old event",
                    "start": makeDate(-30),
                    "end": makeDate(-28),
                    "ad": true
                }, {
                    "id": 1009,
                    "cid": 2,
                    "title": "Board meeting",
                    "start": makeDate(-2, 13),
                    "end": makeDate(-2, 18),
                    "loc": "ABC Inc.",
                    "rem": "60"
                }, {
                    "id": 1010,
                    "cid": 3,
                    "title": "Jenny's final exams",
                    "start": makeDate(-2),
                    "end": makeDate(3, 0, 0, -1),
                    "ad": true
                }, {
                    "id": 1011,
                    "cid": 1,
                    "title": "Movie night",
                    "start": makeDate(2, 19),
                    "end": makeDate(2, 23),
                    "notes": "Don't forget the tickets!",
                    "rem": "60"
                }]
            }
        }
    }
});




/* ----- /calendar/src/form/EventWindow.js ----- */

/**
 * @class Ext.calendar.form.EventWindow
 * @extends Ext.Window
 * <p>A custom window containing a basic edit form used for quick editing of events.</p>
 * <p>This window also provides custom events specific to the calendar so that other calendar components can be easily
 * notified when an event has been edited via this component.</p>
 * @constructor
 * @param {Object} config The config object
 */
Ext.define('Ext.calendar.form.EventWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.eventeditwindow',
    
    requires: [
        'Ext.form.Panel',
        'Ext.calendar.util.Date',
        'Ext.calendar.data.EventModel',
        'Ext.calendar.data.EventMappings'
    ],

    constructor: function(config) {
        var formPanelCfg = {
            xtype: 'form',
            fieldDefaults: {
                msgTarget: 'side',
                labelWidth: 65
            },
            frame: false,
            bodyStyle: 'background:transparent;padding:5px 10px 10px;',
            bodyBorder: false,
            border: false,
            items: [{
                itemId: 'title',
                name: Ext.calendar.data.EventMappings.Title.name,
                fieldLabel: 'Title',
                xtype: 'textfield',
                allowBlank: false,
                emptyText: 'Event Title',
                anchor: '100%'
            },
            {
                xtype: 'daterangefield',
                itemId: 'date-range',
                name: 'dates',
                anchor: '100%',
                fieldLabel: 'When'
            }]
        };
    
        if (config.calendarStore) {
            this.calendarStore = config.calendarStore;
            delete config.calendarStore;
    
            formPanelCfg.items.push({
                xtype: 'calendarpicker',
                itemId: 'calendar',
                name: Ext.calendar.data.EventMappings.CalendarId.name,
                anchor: '100%',
                store: this.calendarStore
            });
        }
    
        this.callParent([Ext.apply({
            titleTextAdd: 'Add Event',
            titleTextEdit: 'Edit Event',
            width: 600,
            autocreate: true,
            border: true,
            closeAction: 'hide',
            modal: false,
            resizable: false,
            buttonAlign: 'left',
            savingMessage: 'Saving changes...',
            deletingMessage: 'Deleting event...',
            layout: 'fit',
    
            defaultFocus: 'title',
            onEsc: function(key, event) {
                        event.target.blur(); // Remove the focus to avoid doing the validity checks when the window is shown again.
                        this.onCancel();
                    },

            fbar: [{
                xtype: 'tbtext',
                text: '<a href="#" id="tblink">Edit Details...</a>'
            },
            '->',
            {
                itemId: 'delete-btn',
                text: 'Delete Event',
                disabled: false,
                handler: this.onDelete,
                scope: this,
                minWidth: 150,
                hideMode: 'offsets'
            },
            {
                text: 'Save',
                disabled: false,
                handler: this.onSave,
                scope: this
            },
            {
                text: 'Cancel',
                disabled: false,
                handler: this.onCancel,
                scope: this
            }],
            items: formPanelCfg
        },
        config)]);
    },

    // private
    newId: 10000,

    /**
     * @event eventadd
     * Fires after a new event is added
     * @param {Ext.calendar.form.EventWindow} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was added
     */

    /**
     * @event eventupdate
     * Fires after an existing event is updated
     * @param {Ext.calendar.form.EventWindow} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was updated
     */

    /**
     * @event eventdelete
     * Fires after an event is deleted
     * @param {Ext.calendar.form.EventWindow} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was deleted
     */

    /**
     * @event eventcancel
     * Fires after an event add/edit operation is canceled by the user and no store update took place
     * @param {Ext.calendar.form.EventWindow} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was canceled
     */

    /**
     * @event editdetails
     * Fires when the user selects the option in this window to continue editing in the detailed edit form
     * (by default, an instance of {@link Ext.calendar.EventEditForm}. Handling code should hide this window
     * and transfer the current event record to the appropriate instance of the detailed form by showing it
     * and calling {@link Ext.calendar.EventEditForm#loadRecord loadRecord}.
     * @param {Ext.calendar.form.EventWindow} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} that is currently being edited
     */

    // private
    initComponent: function() {
        this.callParent();

        this.formPanel = this.items.items[0];
    },

    // private
    afterRender: function() {
        this.callParent();

        this.el.addCls('ext-cal-event-win');

        Ext.get('tblink').on('click', this.onEditDetailsClick, this);
        
        this.titleField = this.down('#title');
        this.dateRangeField = this.down('#date-range');
        this.calendarField = this.down('#calendar');
        this.deleteButton = this.down('#delete-btn');
    },
    
    // private
    onEditDetailsClick: function(e){
        e.stopEvent();
        this.updateRecord(this.activeRecord, true);
        this.fireEvent('editdetails', this, this.activeRecord, this.animateTarget);
    },

    /**
     * Shows the window, rendering it first if necessary, or activates it and brings it to front if hidden.
	 * @param {Ext.data.Record/Object} o Either a {@link Ext.data.Record} if showing the form
	 * for an existing event in edit mode, or a plain object containing a StartDate property (and 
	 * optionally an EndDate property) for showing the form in add mode. 
     * @param {String/Element} animateTarget (optional) The target element or id from which the window should
     * animate while opening (defaults to null with no animation)
     * @return {Ext.Window} this
     */
    show: function(o, animateTarget) {
        // Work around the CSS day cell height hack needed for initial render in IE8/strict:
        var me = this,
            anim = (Ext.isIE8 && Ext.isStrict) ? null: animateTarget,
            M = Ext.calendar.data.EventMappings,
            data = {};

        this.callParent([anim, function(){
            me.titleField.focus(true);
        }]);
        
        this.deleteButton[o.data && o.data[M.EventId.name] ? 'show': 'hide']();

        var rec,
        f = this.formPanel.form;

        if (o.data) {
            rec = o;
            this.setTitle(rec.phantom ? this.titleTextAdd : this.titleTextEdit);
            f.loadRecord(rec);
        }
        else {
            this.setTitle(this.titleTextAdd);

            var start = o[M.StartDate.name],
                end = o[M.EndDate.name] || Ext.calendar.util.Date.add(start, {hours: 1});
            
            data[M.StartDate.name] = start;
            data[M.EndDate.name] = end;
            data[M.IsAllDay.name] = !!o[M.IsAllDay.name] || start.getDate() != Ext.calendar.util.Date.add(end, {millis: 1}).getDate();
            rec = new Ext.calendar.data.EventModel(data);

            f.reset();
            f.loadRecord(rec);
        }

        if (this.calendarStore) {
            this.calendarField.setValue(rec.data[M.CalendarId.name]);
        }
        this.dateRangeField.setValue(rec.data);
        this.activeRecord = rec;

        return this;
    },

    // private
    roundTime: function(dt, incr) {
        incr = incr || 15;
        var m = parseInt(dt.getMinutes(), 10);
        return dt.add('mi', incr - (m % incr));
    },

    // private
    onCancel: function() {
        this.cleanup(true);
        this.fireEvent('eventcancel', this);
    },

    // private
    cleanup: function(hide) {
        if (this.activeRecord && this.activeRecord.dirty) {
            this.activeRecord.reject();
        }
        delete this.activeRecord;

        if (hide === true) {
            // Work around the CSS day cell height hack needed for initial render in IE8/strict:
            //var anim = afterDelete || (Ext.isIE8 && Ext.isStrict) ? null : this.animateTarget;
            this.hide();
        }
    },

    // private
    updateRecord: function(record, keepEditing) {
        var fields = record.getFields(),
            values = this.formPanel.getForm().getValues(),
            name,
            M = Ext.calendar.data.EventMappings,
            obj = {};

        Ext.Array.each(fields, function(f) {
            name = f.name;
            if (name in values) {
                obj[name] = values[name];
            }
        });
        
        var dates = this.dateRangeField.getValue();
        obj[M.StartDate.name] = dates[0];
        obj[M.EndDate.name] = dates[1];
        obj[M.IsAllDay.name] = dates[2];

        record.beginEdit();
        record.set(obj);
        
        if (!keepEditing) {
            record.endEdit();
        }

        return this;
    },
    
    // private
    onSave: function(){
        if(!this.formPanel.form.isValid()){
            return;
        }
        if(!this.updateRecord(this.activeRecord)){
            this.onCancel();
            return;
        }
        this.fireEvent(this.activeRecord.phantom ? 'eventadd' : 'eventupdate', this, this.activeRecord, this.animateTarget);

        // Clear phantom and modified states.
        this.activeRecord.commit();
    },
    
    // private
    onDelete: function(){
        this.fireEvent('eventdelete', this, this.activeRecord, this.animateTarget);
    }
});



/* ----- /calendar/src/data/MemoryEventStore.js ----- */

/*
 * This is a simple in-memory store implementation that is ONLY intended for use with
 * calendar samples running locally in the browser with no external data source. Under
 * normal circumstances, stores that use a MemoryProxy are read-only and intended only
 * for displaying data read from memory. In the case of the calendar, it's still quite
 * useful to be able to deal with in-memory data for sample purposes (as many people 
 * may not have PHP set up to run locally), but by default, updates will not work since the
 * calendar fully expects all CRUD operations to be supported by the store (and in fact
 * will break, for example, if phantom records are not removed properly). This simple
 * class gives us a convenient way of loading and updating calendar event data in memory,
 * but should NOT be used outside of the local samples.
 */
Ext.define('Ext.calendar.data.MemoryEventStore', {
    extend: 'Ext.data.Store',
    model: 'Ext.calendar.data.EventModel',
    
    requires: [
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Ext.calendar.data.EventModel',
        'Ext.calendar.data.EventMappings'
    ],
    
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'evts'
        },
        writer: {
            type: 'json'
        }
    },
    
    // private
    constructor: function(config){
        this.callParent(arguments);
        
        this.sorters = this.sorters || [{
            property: Ext.calendar.data.EventMappings.StartDate.name,
            direction: 'ASC'
        }];
        
        this.idProperty = this.idProperty || Ext.calendar.data.EventMappings.EventId.mapping || 'id';
        this.fields = Ext.calendar.data.EventModel.getFields();
        this.onCreateRecords = Ext.Function.createInterceptor(this.onCreateRecords, this.interceptCreateRecords);
        this.initRecs();
    },
    
    // private - override to make sure that any records added in-memory
    // still get a unique PK assigned at the data level
    interceptCreateRecords: function(records, operation, success) {
        if (success) {
            var i = 0,
                rec,
                len = records.length;
            
            for (; i < len; i++) {
                records[i].data[Ext.calendar.data.EventMappings.EventId.name] = records[i].id;
            }
        }
    },
    
    // If the store started with preloaded inline data, we have to make sure the records are set up
    // properly as valid "saved" records otherwise they may get "added" on initial edit.
    initRecs: function(){
        this.each(function(rec){
            rec.store = this;
            rec.phantom = false;
        }, this);
    },
    
    // private - override the default logic for memory storage
    onProxyLoad: function(operation) {
        var me = this,
            records;
        
        if (me.data && me.data.length > 0) {
            // this store has already been initially loaded, so do not reload
            // and lose updates to the store, just use store's latest data
            me.totalCount = me.data.length;
            records = me.data.items;
        }
        else {
            // this is the initial load, so defer to the proxy's result
            var resultSet = operation.getResultSet(),
                successful = operation.wasSuccessful();

            records = operation.getRecords();

            if (resultSet) {
                me.totalCount = resultSet.total;
            }
            if (successful) {
                me.loadRecords(records, operation);
            }
        }

        me.loading = false;
        me.fireEvent('load', me, records, successful);
    }
});



/* ----- /calendar/src/data/MemoryCalendarStore.js ----- */

/*
 * A simple reusable store that loads static calendar field definitions into memory
 * and can be bound to the CalendarCombo widget and used for calendar color selection.
 */
Ext.define('Ext.calendar.data.MemoryCalendarStore', {
    extend: 'Ext.data.Store',
    model: 'Ext.calendar.data.CalendarModel',
    
    requires: [
        'Ext.data.proxy.Memory',
        'Ext.data.reader.Json',
        'Ext.data.writer.Json',
        'Ext.calendar.data.CalendarModel',
        'Ext.calendar.data.CalendarMappings'
    ],
    
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'calendars'
        },
        writer: {
            type: 'json'
        }
    },

    autoLoad: true,
    
    initComponent: function() {
        var me = this,
            calendarData = Ext.calendar.data;
            
        me.sorters = me.sorters || [{
            property: calendarData.CalendarMappings.Title.name,
            direction: 'ASC'
        }];
        
        me.idProperty = me.idProperty || calendarData.CalendarMappings.CalendarId.name || 'id';
        
        me.fields = calendarData.CalendarModel.prototype.fields.getRange();
        
        me.callParent(arguments);
    }
});



/* ----- /calendar/src/data/Calendars.js ----- */

Ext.define('Ext.calendar.data.Calendars', {
    statics: {
        getData: function(){
            return {
                "calendars":[{
                    "id":    1,
                    "title": "Home"
                },{
                    "id":    2,
                    "title": "Work"
                },{
                    "id":    3,
                    "title": "School"
                }]
            };    
        }
    }
});



/* ----- /calendar/src/CalendarPanel.js ----- */

/**
 * @class Ext.calendar.CalendarPanel
 * @extends Ext.Panel
 * <p>This is the default container for Ext calendar views. It supports day, week and month views as well
 * as a built-in event edit form. The only requirement for displaying a calendar is passing in a valid
 * {@link #calendarStore} config containing records of type {@link Ext.calendar.EventRecord EventRecord}. In order
 * to make the calendar interactive (enable editing, drag/drop, etc.) you can handle any of the various
 * events fired by the underlying views and exposed through the CalendarPanel.</p>
 * {@link #layoutConfig} option if needed.</p>
 * @constructor
 * @param {Object} config The config object
 * @xtype calendarpanel
 */
Ext.define('Ext.calendar.CalendarPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.calendarpanel',
    
    requires: [
        'Ext.layout.container.Card',
        'Ext.calendar.view.Day',
        'Ext.calendar.view.Week',
        'Ext.calendar.view.Month',
        'Ext.calendar.form.EventDetails',
        'Ext.calendar.data.EventMappings'
    ],
    
    /**
     * @cfg {Boolean} showDayView
     * True to include the day view (and toolbar button), false to hide them (defaults to true).
     */
    showDayView: true,
    /**
     * @cfg {Boolean} showWeekView
     * True to include the week view (and toolbar button), false to hide them (defaults to true).
     */
    showWeekView: true,
    /**
     * @cfg {Boolean} showMonthView
     * True to include the month view (and toolbar button), false to hide them (defaults to true).
     * If the day and week views are both hidden, the month view will show by default even if
     * this config is false.
     */
    showMonthView: true,
    /**
     * @cfg {Boolean} showNavBar
     * True to display the calendar navigation toolbar, false to hide it (defaults to true). Note that
     * if you hide the default navigation toolbar you'll have to provide an alternate means of navigating the calendar.
     */
    showNavBar: true,
    /**
     * @cfg {String} todayText
     * Alternate text to use for the 'Today' nav bar button.
     */
    todayText: 'Today',
    /**
     * @cfg {Boolean} showTodayText
     * True to show the value of {@link #todayText} instead of today's date in the calendar's current day box,
     * false to display the day number(defaults to true).
     */
    showTodayText: true,
    /**
     * @cfg {Boolean} showTime
     * True to display the current time next to the date in the calendar's current day box, false to not show it 
     * (defaults to true).
     */
    showTime: true,
    /**
     * @cfg {String} dayText
     * Alternate text to use for the 'Day' nav bar button.
     */
    dayText: 'Day',
    /**
     * @cfg {String} weekText
     * Alternate text to use for the 'Week' nav bar button.
     */
    weekText: 'Week',
    /**
     * @cfg {String} monthText
     * Alternate text to use for the 'Month' nav bar button.
     */
    monthText: 'Month',
    
    layout: 'card',

    // private property
    startDate: new Date(),

    /**
     * @event eventadd
     * Fires after a new event is added to the underlying store
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was added
     */

    /**
     * @event eventupdate
     * Fires after an existing event is updated
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was updated
     */

    /**
     * @event eventdelete
     * Fires after an event is removed from the underlying store
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was removed
     */

    /**
     * @event eventcancel
     * Fires after an event add/edit operation is canceled by the user and no store update took place
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Ext.calendar.EventRecord} rec The new {@link Ext.calendar.EventRecord record} that was canceled
     */

    /**
     * @event viewchange
     * Fires after a different calendar view is activated (but not when the event edit form is activated)
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Ext.Ext.calendar.view.AbstractCalendar} view The view being activated (any valid {@link Ext.calendar.view.AbstractCalendar AbstractCalendar} subclass)
     * @param {Object} info Extra information about the newly activated view. This is a plain object 
     * with following properties:<div class="mdetail-params"><ul>
     * <li><b><code>activeDate</code></b> : <div class="sub-desc">The currently-selected date</div></li>
     * <li><b><code>viewStart</code></b> : <div class="sub-desc">The first date in the new view range</div></li>
     * <li><b><code>viewEnd</code></b> : <div class="sub-desc">The last date in the new view range</div></li>
     * </ul></div>
     */


    //
    // NOTE: CalendarPanel also relays the following events from contained views as if they originated from this:
    //
    /**
     * @event eventsrendered
     * Fires after events are finished rendering in the view
     * @param {Ext.calendar.CalendarPanel} this 
     */
    /**
     * @event eventclick
     * Fires after the user clicks on an event element
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that was clicked on
     * @param {HTMLNode} el The DOM node that was clicked on
     */
    /**
     * @event eventover
     * Fires anytime the mouse is over an event element
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that the cursor is over
     * @param {HTMLNode} el The DOM node that is being moused over
     */
    /**
     * @event eventout
     * Fires anytime the mouse exits an event element
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that the cursor exited
     * @param {HTMLNode} el The DOM node that was exited
     */
    /**
     * @event datechange
     * Fires after the start date of the view changes
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Date} startDate The start date of the view (as explained in {@link #getStartDate}
     * @param {Date} viewStart The first displayed date in the view
     * @param {Date} viewEnd The last displayed date in the view
     */
    /**
     * @event rangeselect
     * Fires after the user drags on the calendar to select a range of dates/times in which to create an event
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Object} dates An object containing the start (StartDate property) and end (EndDate property) dates selected
     * @param {Function} callback A callback function that MUST be called after the event handling is complete so that
     * the view is properly cleaned up (shim elements are persisted in the view while the user is prompted to handle the
     * range selection). The callback is already created in the proper scope, so it simply needs to be executed as a standard
     * function call (e.g., callback()).
     */
    /**
     * @event eventmove
     * Fires after an event element is dragged by the user and dropped in a new position
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that was moved with
     * updated start and end dates
     */
    /**
     * @event initdrag
     * Fires when a drag operation is initiated in the view
     * @param {Ext.calendar.CalendarPanel} this
     */
    /**
     * @event eventresize
     * Fires after the user drags the resize handle of an event to resize it
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Ext.calendar.EventRecord} rec The {@link Ext.calendar.EventRecord record} for the event that was resized
     * containing the updated start and end dates
     */
    /**
     * @event dayclick
     * Fires after the user clicks within a day/week view container and not on an event element
     * @param {Ext.calendar.CalendarPanel} this
     * @param {Date} dt The date/time that was clicked on
     * @param {Boolean} allday True if the day clicked on represents an all-day box, else false.
     * @param {Ext.core.Element} el The Element that was clicked on
     */

    // private
    initComponent: function() {
        this.tbar = {
            cls: 'ext-cal-toolbar',
            border: true,
            items: ['->',{
                id: this.id + '-tb-prev',
                handler: this.onPrevClick,
                scope: this,
                iconCls: 'x-tbar-page-prev'
            }]
        };

        this.viewCount = 0;

        if (this.showDayView) {
            this.tbar.items.push({
                id: this.id + '-tb-day',
                text: this.dayText,
                handler: this.onDayClick,
                scope: this,
                toggleGroup: 'tb-views'
            });
            this.viewCount++;
        }
        if (this.showWeekView) {
            this.tbar.items.push({
                id: this.id + '-tb-week',
                text: this.weekText,
                handler: this.onWeekClick,
                scope: this,
                toggleGroup: 'tb-views'
            });
            this.viewCount++;
        }
        if (this.showMonthView || this.viewCount == 0) {
            this.tbar.items.push({
                id: this.id + '-tb-month',
                text: this.monthText,
                handler: this.onMonthClick,
                scope: this,
                toggleGroup: 'tb-views'
            });
            this.viewCount++;
            this.showMonthView = true;
        }
        this.tbar.items.push({
            id: this.id + '-tb-next',
            handler: this.onNextClick,
            scope: this,
            iconCls: 'x-tbar-page-next'
        });
        this.tbar.items.push('->');

        var idx = this.viewCount - 1;
        this.activeItem = this.activeItem === undefined ? idx: (this.activeItem > idx ? idx: this.activeItem);

        if (this.showNavBar === false) {
            delete this.tbar;
            this.addCls('x-calendar-nonav');
        }

        this.callParent();

        // do not allow override
        if (this.showDayView) {
            var day = Ext.apply({
                xtype: 'dayview',
                title: this.dayText,
                showToday: this.showToday,
                showTodayText: this.showTodayText,
                showTime: this.showTime
            },
            this.dayViewCfg);

            day.id = this.id + '-day';
            day.store = day.store || this.eventStore;
            this.initEventRelay(day);
            this.add(day);
        }
        if (this.showWeekView) {
            var wk = Ext.applyIf({
                xtype: 'weekview',
                title: this.weekText,
                showToday: this.showToday,
                showTodayText: this.showTodayText,
                showTime: this.showTime
            },
            this.weekViewCfg);

            wk.id = this.id + '-week';
            wk.store = wk.store || this.eventStore;
            this.initEventRelay(wk);
            this.add(wk);
        }
        if (this.showMonthView) {
            var month = Ext.applyIf({
                xtype: 'monthview',
                title: this.monthText,
                showToday: this.showToday,
                showTodayText: this.showTodayText,
                showTime: this.showTime,
                listeners: {
                    'weekclick': {
                        fn: function(vw, dt) {
                            this.showWeek(dt);
                        },
                        scope: this
                    }
                }
            },
            this.monthViewCfg);

            month.id = this.id + '-month';
            month.store = month.store || this.eventStore;
            this.initEventRelay(month);
            this.add(month);
        }

        this.add(Ext.applyIf({
            xtype: 'eventeditform',
            id: this.id + '-edit',
            calendarStore: this.calendarStore,
            listeners: {
                'eventadd': {
                    scope: this,
                    fn: this.onEventAdd
                },
                'eventupdate': {
                    scope: this,
                    fn: this.onEventUpdate
                },
                'eventdelete': {
                    scope: this,
                    fn: this.onEventDelete
                },
                'eventcancel': {
                    scope: this,
                    fn: this.onEventCancel
                }
            }
        },
        this.editViewCfg));
    },

    // private
    initEventRelay: function(cfg) {
        cfg.listeners = cfg.listeners || {};
        cfg.listeners.afterrender = {
            fn: function(c) {
                // relay the view events so that app code only has to handle them in one place
                this.relayEvents(c, ['eventsrendered', 'eventclick', 'eventover', 'eventout', 'dayclick',
                'eventmove', 'datechange', 'rangeselect', 'eventdelete', 'eventresize', 'initdrag']);
            },
            scope: this,
            single: true
        };
    },

    // private
    afterRender: function() {
        this.callParent(arguments);
        
        this.body.addCls('x-cal-body');
        
        Ext.defer(function() {
            this.updateNavState();
            this.fireViewChange();
        }, 10, this);
    },

    // private
    onLayout: function() {
        this.callParent();
        if (!this.navInitComplete) {
            this.updateNavState();
            this.navInitComplete = true;
        }
    },

    // private
    onEventAdd: function(form, rec) {
        rec.data[Ext.calendar.data.EventMappings.IsNew.name] = false;
        this.hideEditForm();
        this.eventStore.add(rec);
        this.eventStore.sync();
        this.fireEvent('eventadd', this, rec);
    },

    // private
    onEventUpdate: function(form, rec) {
        this.hideEditForm();
        rec.commit();
        this.eventStore.sync();
        this.fireEvent('eventupdate', this, rec);
    },

    // private
    onEventDelete: function(form, rec) {
        this.hideEditForm();
        this.eventStore.remove(rec);
        this.eventStore.sync();
        this.fireEvent('eventdelete', this, rec);
    },

    // private
    onEventCancel: function(form, rec) {
        this.hideEditForm();
        this.fireEvent('eventcancel', this, rec);
    },

    /**
     * Shows the built-in event edit form for the passed in event record.  This method automatically
     * hides the calendar views and navigation toolbar.  To return to the calendar, call {@link #hideEditForm}.
     * @param {Ext.calendar.EventRecord} record The event record to edit
     * @return {Ext.calendar.CalendarPanel} this
     */
    showEditForm: function(rec) {
        this.preEditView = this.layout.getActiveItem().id;
        this.setActiveView(this.id + '-edit');
        this.layout.getActiveItem().loadRecord(rec);
        return this;
    },

    /**
     * Hides the built-in event edit form and returns to the previous calendar view. If the edit form is
     * not currently visible this method has no effect.
     * @return {Ext.calendar.CalendarPanel} this
     */
    hideEditForm: function() {
        if (this.preEditView) {
            this.setActiveView(this.preEditView);
            delete this.preEditView;
        }
        return this;
    },

    // private
    setActiveView: function(id){
        var l = this.layout,
            tb = this.getDockedItems('toolbar')[0];
        
        // show/hide the toolbar first so that the layout will calculate the correct item size
        if (tb) {
            tb[id === this.id+'-edit' ? 'hide' : 'show']();
        }

        Ext.suspendLayouts();

        l.setActiveItem(id);
        this.activeView = l.getActiveItem();
        
        if(id !== this.id+'-edit'){
           if(id !== this.preEditView){
                l.activeItem.setStartDate(this.startDate, true);
            }
           this.updateNavState();
        }
        Ext.resumeLayouts(true);

        this.fireViewChange();
    },

    // private
    fireViewChange: function() {
        if (this.layout && this.layout.getActiveItem) {
            var view = this.layout.getActiveItem();
            if (view && view.getViewBounds) {
                var vb = view.getViewBounds();
                var info = {
                    activeDate: view.getStartDate(),
                    viewStart: vb.start,
                    viewEnd: vb.end
                };
            }
            this.fireEvent('viewchange', this, view, info);
        }
    },

    // private
    updateNavState: function() {
        if (this.showNavBar !== false) {
            var item = this.layout.activeItem,
                suffix = item.id.split(this.id + '-')[1],
                btn = Ext.getCmp(this.id + '-tb-' + suffix);

            if (btn) {
                btn.toggle(true);
            }
        }
    },

    /**
     * Sets the start date for the currently-active calendar view.
     * @param {Date} dt
     */
    setStartDate: function(dt) {
        this.layout.activeItem.setStartDate(dt, true);
        this.updateNavState();
        this.fireViewChange();
    },

    // private
    showWeek: function(dt) {
        this.setActiveView(this.id + '-week');
        this.setStartDate(dt);
    },

    // private
    onPrevClick: function() {
        this.startDate = this.layout.activeItem.movePrev();
        this.updateNavState();
        this.fireViewChange();
    },

    // private
    onNextClick: function() {
        this.startDate = this.layout.activeItem.moveNext();
        this.updateNavState();
        this.fireViewChange();
    },

    // private
    onDayClick: function() {
        this.setActiveView(this.id + '-day');
    },

    // private
    onWeekClick: function() {
        this.setActiveView(this.id + '-week');
    },

    // private
    onMonthClick: function() {
        this.setActiveView(this.id + '-month');
    },

    /**
     * Return the calendar view that is currently active, which will be a subclass of
     * {@link Ext.calendar.view.AbstractCalendar AbstractCalendar}.
     * @return {Ext.calendar.view.AbstractCalendar} The active view
     */
    getActiveView: function() {
        return this.layout.activeItem;
    }
});




/* ----- /calendar/src/App.js ----- */

/*
 * This calendar application was forked from Ext Calendar Pro
 * and contributed to Ext JS as an advanced example of what can 
 * be built using and customizing Ext components and templates.
 * 
 * If you find this example to be useful you should take a look at
 * the original project, which has more features, more examples and
 * is maintained on a regular basis:
 * 
 *  http://ext.ensible.com/products/calendar
 */
Ext.define('Ext.calendar.App', {
    
    requires: [
        'Ext.Viewport',
        'Ext.layout.container.Border',
        'Ext.picker.Date',
        'Ext.calendar.util.Date',
        'Ext.calendar.CalendarPanel',
        'Ext.calendar.data.MemoryCalendarStore',
        'Ext.calendar.data.MemoryEventStore',
        'Ext.calendar.data.Events',
        'Ext.calendar.data.Calendars',
        'Ext.calendar.form.EventWindow'
    ],

    constructor : function() {
        // Minor workaround for OSX Lion scrollbars
        this.checkScrollOffset();
        
        // This is an example calendar store that enables event color-coding
        this.calendarStore = Ext.create('Ext.calendar.data.MemoryCalendarStore', {
            data: Ext.calendar.data.Calendars.getData()
        });

        // A sample event store that loads static JSON from a local file. Obviously a real
        // implementation would likely be loading remote data via an HttpProxy, but the
        // underlying store functionality is the same.
        this.eventStore = Ext.create('Ext.calendar.data.MemoryEventStore', {
            data: Ext.calendar.data.Events.getData()
        });
        
        // This is the app UI layout code.  All of the calendar views are subcomponents of
        // CalendarPanel, but the app title bar and sidebar/navigation calendar are separate
        // pieces that are composed in app-specific layout code since they could be omitted
        // or placed elsewhere within the application.
        Ext.create('Ext.Viewport', {
            layout: 'border',
            renderTo: 'calendar-ct',
            items: [{
                xtype: 'component',
                id: 'app-header',
                region: 'north',
                height: 35,
                contentEl: 'app-header-content'
            },{
                id: 'app-center',
                title: '...', // will be updated to the current view's date range
                region: 'center',
                layout: 'border',
                listeners: {
                    'afterrender': function(){
                        Ext.getCmp('app-center').header.addCls('app-center-header');
                    }
                },
                items: [{
                    xtype: 'container',
                    id:'app-west',
                    region: 'west',
                    items: [{
                        xtype: 'datepicker',
                        id: 'app-nav-picker',
                        cls: 'ext-cal-nav-picker',
                        listeners: {
                            'select': {
                                fn: function(dp, dt){
                                    Ext.getCmp('app-calendar').setStartDate(dt);
                                },
                                scope: this
                            }
                        }
                    }]
                },{
                    xtype: 'calendarpanel',
                    eventStore: this.eventStore,
                    calendarStore: this.calendarStore,
                    border: false,
                    id:'app-calendar',
                    region: 'center',
                    activeItem: 3, // month view
                    
                    monthViewCfg: {
                        showHeader: true,
                        showWeekLinks: true,
                        showWeekNumbers: true
                    },
                    
                    listeners: {
                        'eventclick': {
                            fn: function(vw, rec, el){
                                this.showEditWindow(rec, el);
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'eventover': function(vw, rec, el){
                            //console.log('Entered evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                        },
                        'eventout': function(vw, rec, el){
                            //console.log('Leaving evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                        },
                        'eventadd': {
                            fn: function(cp, rec){
                                this.showMsg('Event '+ rec.data.Title +' was added');
                            },
                            scope: this
                        },
                        'eventupdate': {
                            fn: function(cp, rec){
                                this.showMsg('Event '+ rec.data.Title +' was updated');
                            },
                            scope: this
                        },
                        'eventcancel': {
                            fn: function(cp, rec){
                                // edit canceled
                            },
                            scope: this
                        },
                        'viewchange': {
                            fn: function(p, vw, dateInfo){
                                if(this.editWin){
                                    this.editWin.hide();
                                }
                                if(dateInfo){
                                    // will be null when switching to the event edit form so ignore
                                    Ext.getCmp('app-nav-picker').setValue(dateInfo.activeDate);
                                    this.updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                                }
                            },
                            scope: this
                        },
                        'dayclick': {
                            fn: function(vw, dt, ad, el){
                                this.showEditWindow({
                                    StartDate: dt,
                                    IsAllDay: ad
                                }, el);
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'rangeselect': {
                            fn: function(win, dates, onComplete){
                                this.showEditWindow(dates);
                                this.editWin.on('hide', onComplete, this, {single:true});
                                this.clearMsg();
                            },
                            scope: this
                        },
                        'eventmove': {
                            fn: function(vw, rec){
                                var mappings = Ext.calendar.data.EventMappings,
                                    time = rec.data[mappings.IsAllDay.name] ? '' : ' \\a\\t g:i a';
                                
                                rec.commit();
                                
                                this.showMsg('Event '+ rec.data[mappings.Title.name] +' was moved to '+
                                    Ext.Date.format(rec.data[mappings.StartDate.name], ('F jS'+time)));
                            },
                            scope: this
                        },
                        'eventresize': {
                            fn: function(vw, rec){
                                rec.commit();
                                this.showMsg('Event '+ rec.data.Title +' was updated');
                            },
                            scope: this
                        },
                        'eventdelete': {
                            fn: function(win, rec){
                                this.eventStore.remove(rec);
                                this.showMsg('Event '+ rec.data.Title +' was deleted');
                            },
                            scope: this
                        },
                        'initdrag': {
                            fn: function(vw){
                                if(this.editWin && this.editWin.isVisible()){
                                    this.editWin.hide();
                                }
                            },
                            scope: this
                        }
                    }
                }]
            }]
        });
    },
        
    // The edit popup window is not part of the CalendarPanel itself -- it is a separate component.
    // This makes it very easy to swap it out with a different type of window or custom view, or omit
    // it altogether. Because of this, it's up to the application code to tie the pieces together.
    // Note that this function is called from various event handlers in the CalendarPanel above.
    showEditWindow : function(rec, animateTarget){
        if(!this.editWin){
            this.editWin = Ext.create('Ext.calendar.form.EventWindow', {
                calendarStore: this.calendarStore,
                listeners: {
                    'eventadd': {
                        fn: function(win, rec){
                            win.hide();
                            rec.data.IsNew = false;
                            this.eventStore.add(rec);
                            this.eventStore.sync();
                            this.showMsg('Event '+ rec.data.Title +' was added');
                        },
                        scope: this
                    },
                    'eventupdate': {
                        fn: function(win, rec){
                            win.hide();
                            rec.commit();
                            this.eventStore.sync();
                            this.showMsg('Event '+ rec.data.Title +' was updated');
                        },
                        scope: this
                    },
                    'eventdelete': {
                        fn: function(win, rec){
                            this.eventStore.remove(rec);
                            this.eventStore.sync();
                            win.hide();
                            this.showMsg('Event '+ rec.data.Title +' was deleted');
                        },
                        scope: this
                    },
                    'editdetails': {
                        fn: function(win, rec){
                            win.hide();
                            Ext.getCmp('app-calendar').showEditForm(rec);
                        }
                    }
                }
            });
        }
        this.editWin.show(rec, animateTarget);
    },
        
    // The CalendarPanel itself supports the standard Panel title config, but that title
    // only spans the calendar views.  For a title that spans the entire width of the app
    // we added a title to the layout's outer center region that is app-specific. This code
    // updates that outer title based on the currently-selected view range anytime the view changes.
    updateTitle: function(startDt, endDt){
        var p = Ext.getCmp('app-center'),
            fmt = Ext.Date.format;
        
        if(Ext.Date.clearTime(startDt).getTime() === Ext.Date.clearTime(endDt).getTime()){
            p.setTitle(fmt(startDt, 'F j, Y'));
        }
        else if(startDt.getFullYear() === endDt.getFullYear()){
            if(startDt.getMonth() === endDt.getMonth()){
                p.setTitle(fmt(startDt, 'F j') + ' - ' + fmt(endDt, 'j, Y'));
            }
            else{
                p.setTitle(fmt(startDt, 'F j') + ' - ' + fmt(endDt, 'F j, Y'));
            }
        }
        else{
            p.setTitle(fmt(startDt, 'F j, Y') + ' - ' + fmt(endDt, 'F j, Y'));
        }
    },
    
    // This is an application-specific way to communicate CalendarPanel event messages back to the user.
    // This could be replaced with a function to do "toast" style messages, growl messages, etc. This will
    // vary based on application requirements, which is why it's not baked into the CalendarPanel.
    showMsg: function(msg){
        Ext.fly('app-msg').update(msg).removeCls('x-hidden');
    },
    clearMsg: function(){
        Ext.fly('app-msg').update('').addCls('x-hidden');
    },
    
    // OSX Lion introduced dynamic scrollbars that do not take up space in the
    // body. Since certain aspects of the layout are calculated and rely on
    // scrollbar width, we add a special class if needed so that we can apply
    // static style rules rather than recalculate sizes on each resize.
    checkScrollOffset: function() {
        var scrollbarWidth = Ext.getScrollbarSize ? Ext.getScrollbarSize().width : Ext.getScrollBarWidth();
        
        // We check for less than 3 because the Ext scrollbar measurement gets
        // slightly padded (not sure the reason), so it's never returned as 0.
        if (scrollbarWidth < 3) {
            Ext.getBody().addCls('x-no-scrollbar');
        }
        if (Ext.isWindows) {
            Ext.getBody().addCls('x-win');
        }
    }
},
function() {
    /*
     * A few Ext overrides needed to work around issues in the calendar
     */
    
    Ext.form.Basic.override({
        reset: function() {
            var me = this;
            // This causes field events to be ignored. This is a problem for the
            // DateTimeField since it relies on handling the all-day checkbox state
            // changes to refresh its layout. In general, this batching is really not
            // needed -- it was an artifact of pre-4.0 performance issues and can be removed.
            //me.batchLayouts(function() {
                me.getFields().each(function(f) {
                    f.reset();
                });
            //});
            return me;
        }
    });
    
    // Currently MemoryProxy really only functions for read-only data. Since we want
    // to simulate CRUD transactions we have to at the very least allow them to be
    // marked as completed and successful, otherwise they will never filter back to the
    // UI components correctly.
    Ext.data.MemoryProxy.override({
        updateOperation: function(operation, callback, scope) {
            operation.setCompleted();
            operation.setSuccessful();
            Ext.callback(callback, scope || this, [operation]);
        },
        create: function() {
            this.updateOperation.apply(this, arguments);
        },
        update: function() {
            this.updateOperation.apply(this, arguments);
        },
        destroy: function() {
            this.updateOperation.apply(this, arguments);
        }
    });
});


