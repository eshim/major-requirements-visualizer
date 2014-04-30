;(function() {
	/**
	 * Makes ".window" DOM elements from the course
	 * data provided in the given JSON object.
	 * @param {URL} 'course.json'
	 * @param {JSON Object} coursedata
	 * @return {null} null
	 */

	$.getJSON('course.json', function(coursedata) {
		var courseLevelArray;	// two-dimensional array of courses
		var courseLevels;		// the maximum level a course can have
		var newDivList;			// alist of divs that will be appended to "#chart-demo"

		newDivList = new Array();
		courseLevels = 4 // this can be made more flexible, but it works for Drew courses

		courseLevelArray = new Array(courseLevels); 
		for (i = 0; i < courseLevels; i++) {
			courseLevelArray[i] = new Array();
		}

	    /**
		 * Adds courses from courseData to courseLevelArray
		 * and makes DOM elements from the information.
		 * @param {Array} coursedata["courses"]
		 * @param {JSON Object} course
		 * @param {Number} courseColumn
		 * @return {null} null
		 */
	    $.each(coursedata["courses"], function(i, course) {
	    	var columnIndex;	// the index of the course in courseLevelArray[courseLevel]
	    	var courseLevel;	// the index of the course in courseLevelArray
	    	var newDiv;			// the new DOM element to be appended to newDivList

	    	courseLevel = Math.floor(course["course-number"]/100) - 1; // 0-indexed
	    	columnIndex = courseLevelArray[courseLevel].push(course) - 1; // 0-indexed
	    	newDiv = makeCourseDiv(course, courseLevel, columnIndex);
	    	// console.log(newdiv);

	    	newDivList.push(newDiv);
	    });

	    $('#chart-demo').append(newDivList);
	});
})();

/**
 * Makes a new div from the course information
 * @param {JSON Object} course
 * @param {Number} courseRow
 * @param {Number} courseColumn
 * @return {DOM Element} newDiv
 */
function makeCourseDiv(course, courseRow, courseColumn) {
	var divId;			// the div id
	var divLocation;	// the column and row coordinates
	var divText;		// department and course number
	var divStyle;		// the string concatenation of the div's style
	var divStyleLeft;	// how many ems the div is from the left
	var divStyleTop;	// how many ems the div is from the top
	var newDiv;			// the complete DOM element
	var status;			// a css class displaying if a student passed

	divLocation = ' row-' + courseRow + ' column-' + courseColumn;
	divId =  course["department"] + course["course-number"];
	divText = course["department"] + ' ' + course["course-number"];
	divStyleTop = 8 * courseRow + 2;
	divStyleLeft = 12 * courseColumn + 5;
	divStyle = 'top:' + divStyleTop + 'em;left:' + divStyleLeft + 'em;';

	switch(course["student-grade"]) {
		case null:
			status = " nottaken";
			break;
		default:
			status = " passed";
			break;
	}

	newDiv = $('<div class="window' + status + divLocation + 
		'" id="' + divId + '" style="' + divStyle + '">' + divText + '</div>');
	    	
	return newDiv;
}