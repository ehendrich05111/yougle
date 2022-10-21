import Shepherd from 'shepherd.js';


const Tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    scrollTo: true
  }
});

Tour.addStep({
  id: 'first-step',
  title: 'First Step',
  text: 'This is the navigation bar.',
  attachTo: {
    element: '.Search-bar',
    on: 'bottom',
  },
  buttons: [
    {
      text: 'Next',
      action: Tour.next
    }
  ]
})

Tour.addStep({
  id: 'second-step',
  title: 'Second Step',
  text: 'This is the logo.',
  attachTo: {
    element: '.Yougle-logo',
    on: 'bottom',
  },
  buttons: [
    {
      text: 'Next',
      action: Tour.next
    }
  ]
})

export default Tour;


