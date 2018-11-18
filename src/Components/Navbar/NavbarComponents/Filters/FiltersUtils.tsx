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

export const getIgnoreListHelper = (
  <div className="filter-ignore-list-helper">
    When checked, will add everyone back to your graph. AtlasP will not
    recommend anyone who is on your ignore list.
    <div className="filters-actionable-container">
      To add (or remove) someone to your ignore list, right click on their
      circle and click "Add to ignore".
    </div>
  </div>
);
