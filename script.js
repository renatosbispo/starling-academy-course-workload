// ==UserScript==
// @name         Starling Academy Course Workload
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Add the total duration of a course's classes to the course header.
// @author       Renato Bispo
// @match        https://starlingacademy.com.br/aula/*
// @icon         https://starlingacademy.com.br/wp-content/uploads/2017/03/cropped-starling_reverse-192x192.png
// @grant        none
// ==/UserScript==

function addCourseWorkloadToPage(courseWorkload) {
  const courseHeader = document.querySelector('.course-header');
  const courseWorkloadElement = document.createElement('small');

  courseWorkloadElement.innerText = `Duração: ${courseWorkload}`;
  courseHeader.appendChild(courseWorkloadElement);
}

function getFormattedCourseWorkload(courseWorkloadInHours) {
  const courseWorkloadInHoursIntegerPart = Math.trunc(courseWorkloadInHours);
  const courseWorkloadDecimalPart =
    courseWorkloadInHours - courseWorkloadInHoursIntegerPart;
  const courseWorkloadInHoursMinutesPart = Math.trunc(
    courseWorkloadDecimalPart * 60
  );

  const stringifiedCourseWorkloadInHoursMinutesPart =
    courseWorkloadInHoursMinutesPart < 10
      ? `0${courseWorkloadInHoursMinutesPart}`
      : `${courseWorkloadInHoursMinutesPart}`;

  return `${courseWorkloadInHoursIntegerPart}h ${courseWorkloadInHoursMinutesPart}m`;
}

function getCourseWorkload(shouldFormatResult = false) {
  const classDurations = document.querySelectorAll('.unit_content small');
  const parsedClassDurations = Array.from(classDurations);

  const courseWorkload = parsedClassDurations.reduce(
    (total, durationElement) => {
      const duration = durationElement.innerText;
      const [minutes, seconds] = duration.split('m');
      const parsedMinutes = Number(minutes);
      const parsedSeconds = Number(seconds.replace(/\D/g, ''));

      return total + parsedMinutes * 60 + parsedSeconds;
    },
    0
  );

  const courseWorkloadInHours = courseWorkload / 3600;

  if (!shouldFormatResult) {
    return `${courseWorkloadInHours}`;
  }

  return getFormattedCourseWorkload(courseWorkloadInHours);
}

(function () {
  'use strict';

  const courseWorkload = getCourseWorkload(true);

  addCourseWorkloadToPage(courseWorkload);
})();
