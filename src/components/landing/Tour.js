export const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
};

export const steps = [
  {
    id: "first-step",
    title: "Welcome to Yougle!",
    text: ["Here's a quick tour of what you can do."],
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
      },
    ],
  },
  {
    id: "second-step",
    title: "Search Page",
    text: ["Use the Search page to search results from your connected services."],
    attachTo: {
      element: ".Search-Link",
      on: "bottom",
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Back",
        type: "back",
      },
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
      },
    ],
  },
  {
    id: "third-step",
    title: "Services",
    text: ["Use the Services page to connect and disconnect services."],
    attachTo: {
      element: ".Services-Link",
      on: "bottom",
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Back",
        type: "back",
      },
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
      }
    ],
  },
  {
    id: "fourth-step",
    title: "Search Messages",
    text: ["Use the search bar to search through the messages of all your connected services."],
    attachTo: {
      element: ".Search-bar",
      on: "bottom",
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Back",
        type: "back",
      },
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
      },
    ],
  },
  {
    id: "fifth-step",
    title: "Search Results",
    text: ["Messages matching your search query will show up below the search bar. Star a message to save it."],
    attachTo: {
      element: ".Table-Results",
      on: "top",
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Back",
        type: "back",
      },
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
      },
    ],
  },
  {
    id: "sixth-step",
    title: "Saved Messages",
    text: ["Use the Saved page to view saved messages or unsave messages."],
    attachTo: {
      element: ".Saved-Link",
      on: "bottom",
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Back",
        type: "back",
      },
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
      }
    ],
  },
  {
    id: "seventh-step",
    title: "Switch Between Tabs",
    text: ["You can use the navigation bar at the top to switch between pages."],
    attachTo: {
      element: ".Navbar",
      on: "bottom",
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Back",
        type: "back",
      },
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
      }
    ],
  },
  {
    id: "eighth-step",
    title: "Let's Start Searching!",
    text: ["Get started by connecting your first service."],
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Back",
        type: "back",
      },
      {
        classes: "shepherd-button-primary",
        text: "Connect a Service",
        action: tourFunction,
      },
    ],
  },
];

function tourFunction() {
  window.location.href="/Services";
}