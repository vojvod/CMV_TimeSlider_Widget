define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dojo/_base/lang',
    'dojo/dom-attr',
    'dojo/dom-construct',
    'dijit/form/DateTextBox',
    'dijit/form/Button',
    'esri/TimeExtent',
    'esri/dijit/TimeSlider',
    'dojo/text!./TimeSlider/templates/TimeSlider.html',
    'dojo/i18n!./TimeSlider/nls/resource',
    'xstyle/css!./TimeSlider/css/TimeSlider.css'
], function (declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, lang, domAttr,
             domConst, DateTextBox, Button, TimeExtent, TimeSlider, TimeSliderTemplate, i18n, css) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: TimeSliderTemplate,
        i18n: i18n,
        timeExtent: null,
        timeSlider: null,
        setToLabel: null,
        setTo: null,
        setFromLabel: null,
        setFrom: null,
        setButton: null,
        timeSliderEnableStyle: 'position:absolute;top:55px;left:90px;z-index:50;width:475px;display: inline;background-color:#F5F5F5;height:40px;padding-top:5px;',
        setFromLabelEnableStyle: 'position:absolute;top:20px;left:90px;z-index:40;width:210px;padding:10px;display: inline;background-color:#F5F5F5;',
        setToLabelEnableStyle: 'position:absolute;top:20px;left:315px;z-index:40;width:230px;padding:10px;display: inline;background-color:#F5F5F5;',
        setFromEnableStyle: 'position:absolute;top:22px;left:195px;z-index:50;width:400px;display: inline;width:120px;',
        setToEnableStyle: 'position:absolute;top:22px;left:365px;z-index:50;width:400px;display: inline;width:120px;',
        setButtonEnableStyle: 'position:absolute;top:22px;left:495px;z-index:50;width:60px;display: inline;width:60px;',
        disableStyle: 'display: none;',
        enable: false,
        postCreate: function () {

            this.timesliderbtn.title = this.i18n.timesliderbntTIP;

            this.timeSlider = new TimeSlider({
                style: 'width: 100%;'
            }, domConst.create('div', {}, this.map.id));
            domAttr.set(this.timeSlider.domNode, 'style', this.timeSliderDisableStyle);

            this.timeExtent = new TimeExtent();
            var from = new Date();
            from.setDate(from.getDate() - 5);
            var to = new Date();
            to.setDate(to.getDate() + 5);
            this.timeExtent.startTime = from;
            this.timeExtent.endTime = to;
            this.timeSlider.setThumbCount(2);
            this.timeSlider.createTimeStopsByTimeInterval(this.timeExtent, 1, 'esriTimeUnitsDays');
            this.timeSlider.setThumbIndexes([0,1]);
            this.timeSlider.setThumbMovingRate(2000);
            this.timeSlider.startup();

            this.setFromLabel = domConst.create('div', {}, this.map.id);
            this.setFromLabel.innerHTML = '<i>' + this.i18n.from  + '<\/i>';
            this.setFrom = new DateTextBox({
                title: 'From',
                name: 'From',
                value: from,
                onChange: lang.hitch(this, '_setFromChange')
            }, domConst.create('div', {}, this.map.id));

            this.setToLabel = domConst.create('div', {}, this.map.id);
            this.setToLabel.innerHTML = '<i>' + this.i18n.to  + '<\/i>';
            this.setTo = new DateTextBox({
                title: 'To',
                name: 'To',
                value: to,
                onChange: lang.hitch(this, '_setToChange')
            }, domConst.create('div', {}, this.map.id));

            this.setButton = new Button({
                label: 'ΟΚ',
                onClick: lang.hitch(this, '_setTimeSlider')
            }, domConst.create('div', {}, this.map.id));

            var t = this;
            this.timeSlider.on('time-extent-change', function(evt) {
                t.setFrom.set('value', evt.startTime);
                t.setTo.set('value', evt.endTime);
            });

        },
        EnableTimeSlider: function () {
            if(!this.enable){
                this.map.setTimeSlider(this.timeSlider);
                domAttr.set(this.timeSlider.domNode, 'style', this.timeSliderEnableStyle);
                domAttr.set(this.setFromLabel, 'style', this.setFromLabelEnableStyle);
                domAttr.set(this.setToLabel, 'style', this.setToLabelEnableStyle);
                domAttr.set(this.setFrom, 'style', this.setFromEnableStyle);
                domAttr.set(this.setTo, 'style', this.setToEnableStyle);
                domAttr.set(this.setButton, 'style', this.setButtonEnableStyle);
                this.enable = true;
                this.timesliderbtn.title = this.i18n.timesliderbntTIPdis;
            }
            else
            {
                var timeExtent = new TimeExtent();
                timeExtent.startTime = new Date('1/1/1990 UTC');
                var dt = new Date();
                dt.setDate(dt.getDate() + 1);
                timeExtent.endTime = dt;
                this.map.setTimeExtent(timeExtent);
                domAttr.set(this.timeSlider.domNode, 'style', this.disableStyle);
                domAttr.set(this.setFromLabel, 'style', this.disableStyle);
                domAttr.set(this.setToLabel, 'style', this.disableStyle);
                domAttr.set(this.setFrom, 'style', this.disableStyle);
                domAttr.set(this.setTo, 'style', this.disableStyle);
                domAttr.set(this.setButton, 'style', this.disableStyle);
                this.enable = false;
                this.timesliderbtn.title = this.i18n.timesliderbntTIP;
            }
        },
        _setFromChange: function(evt){
            this.setTo.constraints.min = evt;
        },
        _setToChange: function(evt){
            this.setFrom.constraints.max = evt;
        },
        _setTimeSlider: function(){
            this.timeExtent.startTime = this.setFrom.value;
            this.timeExtent.endTime = this.setTo.value;
            this.timeSlider.createTimeStopsByTimeInterval(this.timeExtent, 1, 'esriTimeUnitsDays');
            this.timeSlider.startup();

        }
    });
});
