export const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: false,
};

export const steps = [
  {
    id: "first-step",
    title: "First Step",
    text: ["This is the navigation bar."],
    attachTo: {
      element: ".Search-bar",
      on: "bottom",
    },
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
    title: "Second Step",
    text: ["This is the Yougle logo."],
    attachTo: {
      element: ".Yougle-logo",
      on: "bottom",
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
      },
    ],
  },
];
