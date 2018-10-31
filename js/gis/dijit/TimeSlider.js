define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dijit/form/DateTextBox',
    'dijit/form/Button',
    'esri/TimeExtent',
    'esri/dijit/TimeSlider',
    'dojo/text!./TimeSlider/templates/TimeSlider.html',
    'dojo/i18n!./TimeSlider/nls/resource',
    'xstyle/css!./TimeSlider/css/TimeSlider.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, domAttr,
  domConst, domStyle, DateTextBox, Button, TimeExtent, TimeSlider, TimeSliderTemplate, i18n, css) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: TimeSliderTemplate,
        i18n: i18n,
        enable: false,
        postCreate: function () {
            this.timesliderbtn.title = this.i18n.timesliderbntTIP;
            // Create time slider
            this.timeSlider = new TimeSlider({
                style: 'width: 100%;'
            }, this.timesliderDiv);
            this.map.setTimeSlider(this.timeSlider);

            // Create time extent for map
            this.timeExtent = new TimeExtent();
            var from = new Date();
            from.setDate(from.getDate() - 5);
            var to = new Date();
            to.setDate(to.getDate() + 5);
            this.timeExtent.startTime = from;
            this.timeExtent.endTime = to;
            this.timeSlider.setThumbCount(2);
            this.timeSlider.createTimeStopsByTimeInterval(this.timeExtent, 1, 'esriTimeUnitsDays');
            this.timeSlider.setThumbIndexes([0, 1]);
            this.timeSlider.setThumbMovingRate(2000);
            this.timeSlider.startup();
            this.map.setTimeSlider(this.timeSlider);
            
            this.dateIndicatorText.innerHTML = this._formatDate(from) + ' - ' + this._formatDate(to);
            this.timeSlider.on('time-extent-change', lang.hitch(this, function (evt) {
                this.dateIndicatorText.innerHTML = this._formatDate(evt.startTime) + ' - ' + this._formatDate(evt.endTime);
            }));

            this.fromDateLabel.innerHTML = this.i18n.from;
            this.fromDate.set('value', from);
            this.fromDate.on('change', lang.hitch(this, this._fromDateChange));
            

            this.toDateLabel.innerHTML = this.i18n.to;
            this.toDate.set('value', to);
            this.toDate.on('change', lang.hitch(this, this._toDateChange));

            this.setButton.on('click', lang.hitch(this, this._setTimeSlider));
        },

            
        EnableTimeSlider: function () {
            if (!this.enable) {
                domStyle.set(this.timeSliderControlsContainer, 'display', '');
                this.enable = true;
                this.timesliderbtn.title = this.i18n.timesliderbntTIPdis;
            } else {
                domStyle.set(this.timeSliderControlsContainer, 'display', 'none');
                this.enable = false;
                this.timesliderbtn.title = this.i18n.timesliderbntTIP;
            }
        },
        _fromDateChange: function (evt) {
            if (evt) {
                this.toDate.constraints.min = evt;
            }
        },
        _toDateChange: function (evt) {
            if (evt) {
                this.fromDate.constraints.max = evt;
            }
        },
        _setTimeSlider: function () {
            this.timeExtent.startTime = this.fromDate.value;
            this.timeExtent.endTime = this.toDate.value;
            this.timeSlider.createTimeStopsByTimeInterval(this.timeExtent, 1, 'esriTimeUnitsDays');
            this.timeSlider.startup();
        },
        _formatDate: function(date) {
            return date.toDateString();
        }
    });
});