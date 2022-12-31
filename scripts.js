// ==UserScript==
// @name         Starling Academy Course Workload
// @namespace    https://github.com/renatosbispo
// @version      2.0.0
// @description  Greasy Fork script for the Starling Academy of Music's platform that adds the total duration of a course's classes to the course header.
// @author       Renato Bispo
// @license      MIT
// @homepage     https://github.com/renatosbispo/starling-academy-course-workload
// @supportURL   https://github.com/renatosbispo/starling-academy-course-workload/issues
// @match        https://starlingacademy.com.br/aula/*
// @icon         https://starlingacademy.com.br/wp-content/uploads/2017/03/cropped-starling_reverse-192x192.png
// @grant        none
// ==/UserScript==

class CourseWorkloadManager {
  constructor(
    courseWorkloadContainerSelector,
    classLengthSelector,
    courseWorkloadLabel = 'Duração'
  ) {
    this.courseWorkloadContainerSelector = courseWorkloadContainerSelector;
    this.classLengthSelector = classLengthSelector;
    this.courseWorkloadLabel = courseWorkloadLabel;

    this.courseWorkloadContainer = this.getCourseWorkloadContainer();
    this.classLengthElements = this.getClassLengthElements();

    this.courseWorkloadInSeconds = this.getCourseWorkloadInSeconds();
    this.formattedCourseWorkload = this.getFormattedCourseWorkload();
  }

  buildCourseWorkloadElement() {
    const courseWorkloadElement = document.createElement('small');

    courseWorkloadElement.innerText = `${this.courseWorkloadLabel}: ${this.formattedCourseWorkload}`;

    this.courseWorkloadElement = courseWorkloadElement;
  }

  addCourseWorkloadToPage() {
    this.buildCourseWorkloadElement();

    this.courseWorkloadContainer.appendChild(this.courseWorkloadElement);
  }

  stringifyDurationPart(durationPart, suffix) {
    if (!durationPart) {
      return '';
    }

    return `${
      durationPart < 10 ? `0${durationPart}` : `${durationPart}`
    }${suffix}${suffix === 's' ? '' : ' '}`;
  }

  getClassLengthInSeconds(stringifiedClassLength) {
    const multipliers = { h: 3600, m: 60, s: 1 };

    return stringifiedClassLength.split(' ').reduce((total, item) => {
      const unit = item.replace(/[0-9]/g, '');
      const value = item.replace(/\D/g, '');

      return total + value * multipliers[unit];
    }, 0);
  }

  getClassLengthElements() {
    return document.querySelectorAll(this.classLengthSelector);
  }

  getCourseWorkloadContainer() {
    return document.querySelector(this.courseWorkloadContainerSelector);
  }

  getCourseWorkloadInSeconds() {
    const parsedClassLengthElements = Array.from(this.classLengthElements);

    return parsedClassLengthElements.reduce((total, classLengthElement) => {
      const stringifiedClassLength = classLengthElement.innerText;

      return total + this.getClassLengthInSeconds(stringifiedClassLength);
    }, 0);
  }

  getFormattedCourseWorkload() {
    let formattedCourseWorkload = '';

    const courseWorkloadInHours = this.courseWorkloadInSeconds / 3600;
    const fullHoursInCourseWorkload = Math.trunc(courseWorkloadInHours);

    formattedCourseWorkload += this.stringifyDurationPart(
      fullHoursInCourseWorkload,
      'h'
    );

    const courseWorkloadWithoutFullHoursInMinutes =
      (courseWorkloadInHours - fullHoursInCourseWorkload) * 60;

    const fullMinutesInCourseWorkloadWithoutFullHours = Math.trunc(
      courseWorkloadWithoutFullHoursInMinutes
    );

    formattedCourseWorkload += this.stringifyDurationPart(
      fullMinutesInCourseWorkloadWithoutFullHours,
      'm'
    );

    const courseWorkloadWithoutFullHoursAndMinutesInSeconds =
      (courseWorkloadWithoutFullHoursInMinutes -
        fullMinutesInCourseWorkloadWithoutFullHours) *
      60;

    formattedCourseWorkload += this.stringifyDurationPart(
      Math.trunc(courseWorkloadWithoutFullHoursAndMinutesInSeconds),
      's'
    );

    return formattedCourseWorkload;
  }
}

(function () {
  'use strict';

  try {
    const courseWorkloadManager = new CourseWorkloadManager(
      '.course-header',
      '.unit_content small'
    );

    courseWorkloadManager.addCourseWorkloadToPage();
  } catch (error) {
    alert(
      'An error ocurred during the execution of the script "Starling Academy Course Workload". Contact the developer for support: renatosilvabispo@outlook.com'
    );

    console.error(error);
  }
})();
