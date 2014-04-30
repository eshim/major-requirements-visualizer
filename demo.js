;(function() {
	jsPlumb.ready(function() {			
		$.getJSON('course.json', function(coursedata) {
			// this will help to organize courses when drawn
			var courseLevels = 4 // this can be made more flexible, but it works for Drew courses (100-400) level
			var courseLevelArray = new Array(courseLevels); 
			for (i = 0; i < courseLevels; i++) {
				courseLevelArray[i] = new Array();
			}
			$.each(coursedata["courses"], function(i, course) {
		    	var courseLevel = Math.floor(course["course-number"]/100) - 1; // 0-indexed
		    	courseLevelArray[courseLevel].push(course);
		    });

			// colors for borders and connectors based on status
			var neutralColor = "grey", 
			dangerColor = "red";

			var instance = jsPlumb.getInstance({	
				// since an instance is created, jsPlumb methods we 
				// want applied to this instance need to begin with
				// "instance" (i.e "instance.show("window")) rather
				// than "jsPlumb (i.e. "jsPlumb.show("window"))	
				Connector : [ "Bezier", { curviness:50 } ],
				DragOptions : { cursor: "pointer", zIndex:2000 },
				PaintStyle : { strokeStyle:neutralColor, lineWidth:2 },
				EndpointStyle : { radius:1, fillStyle:neutralColor },
				HoverPaintStyle : {strokeStyle:"#ec9f2e" },
				EndpointHoverStyle : {fillStyle:"#ec9f2e" },
				ConnectionsDetachable:false,
				Container:"chart-demo"
			});	
				
			// suspend drawing and initialise.
			instance.doWhileSuspended(function() {		
				// declare some common values:
				var arrowCommon = {foldback:.623, fillStyle:neutralColor, width:10 },
					// use three-arg spec to create two different arrows with the common values:
					overlays = [
						[ "Arrow", { location:0.7 }, arrowCommon ]
					];
				// add endpoints, giving them a UUID.
				var windows = jsPlumb.getSelector(".chart-demo .window");
				for (var i = 0; i < windows.length; i++) {
					instance.addEndpoint(windows[i], {
						uuid:windows[i].getAttribute("id") + "-bottom",
						anchor:"Bottom",
						maxConnections:-1
					});
					instance.addEndpoint(windows[i], {
						uuid:windows[i].getAttribute("id") + "-top",
						anchor:"Top",
						maxConnections:-1
					});
					instance.addEndpoint(windows[i], {
						uuid:windows[i].getAttribute("id") + "-left",
						anchor:"Left",
						maxConnections:-1
					});
					instance.addEndpoint(windows[i], {
						uuid:windows[i].getAttribute("id") + "-right",
						anchor:"Right",
						maxConnections:-1
					});
				}

				// Making connections based on interactions
				// 1
				instance.connect({uuids:["CSCI117-right", "CSCI151-left" ], overlays:overlays}).setVisible(false);
				

					for (var i = 0; i < courseLevelArray.length; i++){ // search each level
			    		for (var j = 0; j < courseLevelArray[i].length; j++) { // for courses
			    			var course = courseLevelArray[i][j];
			    			var courseIndex = [i, j];

			    			if (course["prerequisites"].length > 0) {
								makeConnectors(course, courseIndex, instance, overlays);
			    			}
			    		}
			    	}
			    	
	    		
			});
			// show/hide connections on hover
			$("div.window").mouseenter(function() {
				// show window's connections on mouseenter
				instance.show(this.id);
			}).mouseleave(function() {
				// hide window's connections on mouseleave
				instance.hide(this.id);
			});

			$("div.window").click(function() {
				var divId			// the Id for this div
				var deptNo;			// the course department and number
				var courseRegexp; 	// the regular expression used to parse the course info
				var courseNo;		// the course number
				var courseDept;		// the course's department
				var foundCourse;	// the course JSON info
				var courseNoInt;	// courseNo parsed to Int
				var courseNumberInt;// course["course-number"] parsed to Int
				var fullCourseTitle;// the department, number and title of the course

				courseRegexp = /([A-Z]+)(\d+)/
				divId = $(this).attr('id');
				deptNo = courseRegexp.exec(divId);
				courseDept = deptNo[1];
				courseNo = deptNo[2];

				$.each(coursedata["courses"], function(i, course) {
					if (course["department"] == courseDept) {
						courseNumberInt = parseInt(course["course-number"]);
						courseNoInt = parseInt(courseNo);
						
						if (courseNumberInt - courseNoInt == 0) { 
							// not sure why, but == operator won't work
							foundCourse = course;
						}
					}
				})

				fullCourseTitle = foundCourse["department"] + " " + 
					foundCourse["course-number"] + " - " + foundCourse["name"];
				$('#course-title').text(fullCourseTitle);
				$('#course-description p').text(foundCourse["description"]);


				

			})
		});

	});
})();

/**
 * Makes ocnnectors based on differences
 * in placement by comparing the index of
 * courses to their prerequisites.
 * @param {JSON Object} course
 * @param {Array} courseIndex
 * @param {jsPlumb Instance} instance
 * @param {overlays} overlays
 * @return {null} null
 */
function makeConnectors(course, courseIndex, instance, overlays) {
	var colDiff;			// course and prereq column index difference
	var courseId;			// the concatenated department and course number
	var divCol;				// the column index of the course's div
	var divRow;				// the row index of the course's div
	var indexRegexp;		// the regular expression used to capture prereqLocation
	var prereqCol;			// the column index of the prerequisite course
	var prereqCourse;		// the prerequisite course information
	var prereqId;			// the concatenated department and prerequisite course number
	var prereqIndex;		// the index of the prerequisite course in course["prerequisites"]
	var prereqLocation;		// the captured column and row number of the prerequisite
	var prereqRow;			// the column of the prerequisite div
	var prereqDivClasses;	// the class attribute string of the prerequisite div
	var rowDiff;			// course and prereq row index difference

	for (prereqIndex = 0; prereqIndex < course["prerequisites"].length; prereqIndex++) {
		courseId = course["department"] + course["course-number"];
		prereqCourse = course["prerequisites"][prereqIndex]; // make a connection
		prereqId = prereqCourse["department"] + prereqCourse["course-number"];
		divRow = courseIndex[0]; 
		divCol = courseIndex[1];
		prereqDivClasses = $('#' + prereqId).attr('class');
		indexRegexp = /row-(\d+) column-(\d+)/;
		prereqLocation = indexRegexp.exec(prereqDivClasses);
		prereqRow = prereqLocation[1];
		prereqCol = prereqLocation[2];
		rowDiff = divRow - parseInt(prereqRow);
		colDiff = divCol - parseInt(prereqCol);

		if (rowDiff > 0) { // if course is below prereq
			instance.connect({uuids:[prereqId + '-bottom', courseId + '-top' ],
				overlays:overlays}).setVisible(false);
		} else if (rowDiff == 0){ // if course is on the same level as prereq
			if (colDiff == 1) { // prereq is left of target div
				instance.connect({uuids:[prereqId + '-right', courseId + '-left' ], 
					overlays:overlays}).setVisible(false);
			} else if (colDiff == -1) { // prereq is right of target div
				instance.connect({uuids:[prereqId + '-left', courseId + '-right' ], 
					overlays:overlays}).setVisible(false);
			} else {
				instance.connect({uuids:[prereqId + '-bottom', courseId + '-top' ], 
					overlays:overlays}).setVisible(false);
			}
		} else if (rowDiff < 0){ // if somehow, the prerequisitie is below course
			instance.connect({uuids:[prereqId + '-left', courseId + '-left' ], 
				overlays:overlays}).setVisible(false);
		}
	}	
}



/**
 * returns course information as a
 * JSON object.
 * @param {Array} courseList
 * @param {String} courseDept
 * @param {Integer} courseNo
 * @return {JSON Object} course
 */
function findCourse(courseList, courseDept, courseNo) {
	$.each(courseList, function(i, course) {
		// console.log(course);
		if (course["department"] == courseDept) {
			
			var coursenumber = parseInt(course["course-number"]);
			var coNo = parseInt(courseNo);
			// console.log(typeof coursenumber);
			// console.log(typeof coNo);
			// console.log(coursenumber - coNo);

			if (coursenumber - coNo == 0) { 
				// not sure why, but == operator won't work
				console.log(course);
				return course["description"];
			}
		}
	
	})
}