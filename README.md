# CMV_TimeSlider_Widget
# Time Slider Widget
A widget for CMV (http://cmv.io/).

![alt tag](https://github.com/vojvod/CMV_TimeSlider_Widget/blob/master/img.jpg)

## Widget Configuration
Add the widget configuration object to the widgets object in viewer.js.
```javascript
widgets: {
    ...
    timesliderTool: {
        include: true,
        id: 'timesliderTool',
        type: 'domNode',
        path: 'gis/dijit/TimeSlider',
        title: 'Time Slider',
        srcNodeRef: 'timeButton',
        options: {
            map: true,
            mapRightClickMenu: false,
            mapClickMode: true
        }
    },
    ...
}
```
Copy TimeSlider folder and TimeSlider.js to folder gis/dijit/ at your CMV installation.

Modify js/viewer/templates/mapOverlay.html file.
```javascript
...
	<div style="position: absolute;left:19px;top:180px;z-index:40;">
        <div id="timeButton">
        </div>
    </div>
...
```