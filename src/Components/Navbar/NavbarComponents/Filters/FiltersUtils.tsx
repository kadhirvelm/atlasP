import * as React from "react";

export const getDateFiltersHelper = (
  <div className="filters-date-helper">
    When was the last time you saw this person?
    <div className="filters-actionable-container">
      <div className="filters-date-helper-single-row">
        <div className="filters-date-helper-single-row-title">Blue</div>
        <div className="filters-date-line blue" />
        <div className="filters-date-helper-single-row-description">
          In an upcoming event
        </div>
      </div>
      <div className="filters-date-helper-single-row">
        <div className="filters-date-helper-single-row-title">Green</div>
        <div className="filters-date-line green" />
        <div className="filters-date-helper-single-row-description">
          Less than 30 days
        </div>
      </div>
      <div className="filters-date-helper-single-row">
        <div className="filters-date-helper-single-row-title">Yellow</div>
        <div className="filters-date-line green yellow" />
        <div className="filters-date-helper-single-row-description">
          Between 30 and 90 days
        </div>
      </div>
      <div className="filters-date-helper-single-row">
        <div className="filters-date-helper-single-row-title">Red</div>
        <div className="filters-date-line green red" />
        <div className="filters-date-helper-single-row-description">
          More than 90 days
        </div>
      </div>
    </div>
  </div>
);

export const getFrequencyFiltersHelpers = (
  <div className="filter-frequency-helper">
    How often do you want to see this person? Move the sliders to adjust the
    filter.
    <div className="filters-actionable-container filters-frequency-text">
      You can change a person's frequency by clicking on their name in the blue
      panel on the right side of your screen.
    </div>
  </div>
);
