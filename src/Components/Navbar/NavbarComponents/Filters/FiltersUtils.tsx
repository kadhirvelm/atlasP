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
  <div className="filter-ignore-list-helper">
    At what frequency do you want to see this person? Check the ignore box to
    include all your ignored friends on the graph.
  </div>
);
