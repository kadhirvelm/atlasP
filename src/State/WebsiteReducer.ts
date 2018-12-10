import { setWith, TypedReducer } from "redoodle";

import IStoreState from "./IStoreState";
import {
  AddGraphFilter,
  AddHighlightConnection,
  AddPeopleToEvent,
  ChangeGraphType,
  DisplayRecommendation,
  OpenNavbarDialog,
  RemoveAllHighlights,
  RemoveGraphFilter,
  RemoveHighlightConnection,
  SelectEvent,
  SetContextMenuNode,
  SetGraphRef,
  SetInfoPerson,
  SetRangeFilter
} from "./WebsiteActions";

export const WebsiteReducer = TypedReducer.builder<
  IStoreState["WebsiteReducer"]
>()
  .withHandler(SetInfoPerson.TYPE, (state, payload) => {
    return setWith(state, {
      infoPerson: payload
    });
  })
  .withHandler(SetGraphRef.TYPE, (state, payload) => {
    return setWith(state, {
      graphRef: payload
    });
  })
  .withHandler(SelectEvent.TYPE, (state, payload) => {
    return setWith(state, {
      selectedEvent: payload
    });
  })
  .withHandler(AddGraphFilter.TYPE, (state, payload) => {
    if (
      state.graphFilters.find(filter => filter.id === payload.id) !== undefined
    ) {
      return state;
    }
    return setWith(state, {
      graphFilters: state.graphFilters.concat(payload)
    });
  })
  .withHandler(RemoveGraphFilter.TYPE, (state, payload) => {
    const index = state.graphFilters.findIndex(filter => filter.id === payload);
    if (index === -1) {
      return state;
    }
    const graphFiltersCopy = state.graphFilters.slice();
    graphFiltersCopy.splice(index, 1);
    return setWith(state, {
      graphFilters: graphFiltersCopy
    });
  })
  .withHandler(ChangeGraphType.TYPE, (state, payload) => {
    return setWith(state, {
      graphType: payload
    });
  })
  .withHandler(SetContextMenuNode.TYPE, (state, payload) => {
    return setWith(state, {
      contextMenuNode: payload
    });
  })
  .withHandler(AddHighlightConnection.TYPE, (state, payload) => {
    const highlightConnections = new Set(state.highlightConnections);
    highlightConnections.add(payload);
    return setWith(state, {
      highlightConnections
    });
  })
  .withHandler(RemoveHighlightConnection.TYPE, (state, payload) => {
    const highlightConnections = new Set(state.highlightConnections);
    highlightConnections.delete(payload);
    return setWith(state, {
      highlightConnections
    });
  })
  .withHandler(RemoveAllHighlights.TYPE, state => {
    return {
      ...state,
      highlightConnections: new Set()
    };
  })
  .withHandler(DisplayRecommendation.TYPE, (state, payload) => {
    return setWith(state, {
      displayRecommendation: payload
    });
  })
  .withHandler(OpenNavbarDialog.TYPE, (state, payload) => {
    return setWith(state, {
      openNavbarDialog: payload
    });
  })
  .withHandler(AddPeopleToEvent.TYPE, (state, payload) => {
    return setWith(state, {
      additionalPeopleToEvent: [payload]
    });
  })
  .withHandler(SetRangeFilter.TYPE, (state, payload) => {
    return setWith(state, {
      rangeFilter: payload
    });
  })
  .build();
