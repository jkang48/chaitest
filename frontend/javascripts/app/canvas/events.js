  /**************************************
    These are the main fabric events happening
    Remeber all the events are happening on the canvas, so we can't write
    handler for individual object. So the approch is different from DOM
    all the events are send from canvas and we check if the event has particular target.
  ***************************************/
window.ChaiBioTech.ngApp.factory('events', [
  'ExperimentLoader',
  'previouslySelected',
  'popupStatus',
  'previouslyHoverd',

  function(ExperimentLoader, previouslySelected, popupStatus, previouslyHoverd) {
    return function(C, $scope) {

      this.canvas = C.canvas;
      var that = this;
      console.log("Events loaded .... !", ExperimentLoader);
      // We write this handler so that gather data popup is forced to hide when
      // clicked at some other part of the page, Given pop up is active.

      angular.element('body').click(function(evt) {
        if(popupStatus.popupStatusGatherData && evt.target.parentNode.id != "gather-data-button") {
            // Here we induce a click so that, angular hides the popup.
            angular.element('#gather-data-button').click();
        } else if(popupStatus.popupStatusAddStage && evt.target.id != "add-stage") {
            angular.element('#add-stage').click();
        }

      });

      angular.element('.canvas-container').mouseleave(function() {

        if(C.editStageStatus === false) {
            if(previouslyHoverd.step) {
              previouslyHoverd.step.closeImage.setOpacity(0);
            }
            previouslyHoverd.step = null;
            C.canvas.renderAll();
        }
      });

      this.selectStep = function(circle) {

        $scope.summaryMode = false;
        circle.manageClick();
        $scope.applyValuesFromOutSide(circle);
      };

      this.containInfiniteStep = function(step) {

        var stage = step.parentStage;
        if(stage.next) {
          return false;
        }

        var lastOne = stage.childSteps[stage.childSteps.length - 1];
        if(lastOne.circle.holdTime.text === "∞") {
          return true;
        }

        return false;
      };

      this.infiniteStep =  function(step) {

        if(step.circle.holdTime.text === "∞") {
          return true;
        }
        return false;

      };

      this.calculateMoveLimit = function(moveElement) {

        var lastStep = C.allStepViews[C.allStepViews.length - 1];

        if(lastStep.circle.holdTime.text === "∞") {
          if(moveElement === "step") {
            return ((lastStep.left + 3) - 120);
          } else if(moveElement === "stage") {
            return ((lastStep.parentStage.left + 3) - 120);
          }
        }

        return lastStep.left + 3;
      };

      this.onTheMoveDragGroup = function(dragging) {

        var indicator = dragging;
        if(indicator.left < 35) {
          indicator.setLeft(35);
        } else if(indicator.left > C.moveLimit) {
          indicator.setLeft(C.moveLimit);
        } else {
          indicator.setLeft(dragging.left);
          indicator.setCoords();
          indicator.onTheMove(C);
        }
      };

      this.footerMouseOver = function(indicate, me, moveElement) {

        indicate.changeText(me.parentStage.index, me.index);
        indicate.currentStep = me;
        C.moveLimit = that.calculateMoveLimit(moveElement);
        C.canvas.bringToFront(indicate);
        indicate.setLeft(me.left + 4);
        indicate.setCoords();
        indicate.setVisible(true);
        C.canvas.renderAll();

      };

      this.canvas.on("mouse:over", function(evt) {
        if(evt.target) {
          var me;

          switch(evt.target.name) {

            case "stepGroup":
              me = evt.target.me;
              if(C.editStageStatus === false) {
                  me.closeImage.animate('opacity', 1, {
                    duration: 400,
                    onChange: C.canvas.renderAll.bind(C.canvas)
                  });
                  if(previouslyHoverd.step) {
                    previouslyHoverd.step.closeImage.animate('opacity', 0, {
                      duration: 400,
                      onChange: C.canvas.renderAll.bind(C.canvas)
                    });
                  }
                  previouslyHoverd.step = me;
                  C.canvas.renderAll();
              }
            break;

            case "deleteStepButton":
              that.canvas.hoverCursor = "pointer";
            break;
            case "moveStepImage":

              evt.target.setVisible(false);
              C.stageMoveIndicator.setVisible(false);
              me = evt.target.step;
              if(! that.infiniteStep(me)) {
                that.footerMouseOver(C.indicator, me, "step");
              }

            break;

            case "blackFooter":

            case "commonStep":

              me = evt.target.step;
              C.indicator.setVisible(false);
              if(! that.containInfiniteStep(me)) { // If the stage has infinite hold , we cant move it.
                that.footerMouseOver(C.stageMoveIndicator, me, "stage");
              }

            break;
          }
        }
      });

      this.canvas.on("mouse:out", function(evt) {
        if(evt.target) {
          var me;
          switch(evt.target.name) {

            case "dragStepGroup":

              evt.target.setVisible(false);
              me = evt.target.currentStep;
              me.whiteFooterImage.setVisible(true);
              C.canvas.renderAll();
            break;

            case "deleteStepButton":
              that.canvas.hoverCursor = "move";
            break;

            case "dragStageGroup":

              evt.target.setVisible(false);
              C.canvas.renderAll();
              break;
          }
        }
      });
      /**************************************
          what happens when click is happening in canvas.
          what we do is check if the click is up on some particular events.
          and we send the changes to backbone views.
      ***************************************/
      this.canvas.on("mouse:down", function(evt) {
        if(evt.target) {
          var me;

          switch(evt.target.name)  {

            case "stepGroup":

              me = evt.target.me;
              that.selectStep(me.circle);

            break;

            case "controlCircleGroup":

              me = evt.target.me;
              that.selectStep(me);

            break;

            case "commonStep":

              me = evt.target.step;
              that.selectStep(me.circle);

            break;

            case "dragStepGroup":

              evt.target.startPosition = evt.target.left;
              //C.moveLimit = C.allStepViews[C.allStepViews.length - 1].left + 3;
            break;

            case "dragStageGroup":

              evt.target.startPosition = evt.target.left;
              //C.moveLimit = C.allStepViews[C.allStepViews.length - 1].left + 3;
              //C.canvas.bringToFront(C.indicator);
              //C.canvas.renderAll();

            break;

            case "deleteStepButton":

              me  = evt.target.me;
              that.selectStep(me.circle);
              ExperimentLoader.deleteStep($scope)
              .then(function(data) {
                console.log("deleted", data);
                me.parentStage.deleteStep({}, me);
                C.canvas.renderAll();
              });


            break;
          }
        } else { // if the click is on canvas
          $scope.$apply(function() {
            $scope.summaryMode = true;
          });
          var circle = previouslySelected.circle;
          circle.parent.parentStage.unSelectStage();
          circle.parent.unSelectStep();
          circle.makeItSmall();
        }
      });

      /**************************************
          Here we write what happens when we drag over the canvas.
          here too we look for the target in the event and do the action.
      ***************************************/
      this.canvas.on('object:moving', function(evt) {

        if(evt.target) {
          switch(evt.target.name) {

            case "controlCircleGroup":
              var targetCircleGroup = evt.target,
              me = evt.target.me;
              me.manageDrag(targetCircleGroup);
              $scope.$apply(function() {
                $scope.step.temperature = me.model.temperature;
              });
            break;

            case "dragStepGroup":
              that.onTheMoveDragGroup(evt.target);
            break;

            case "dragStageGroup":
              that.onTheMoveDragGroup(evt.target);
            break;

          }
        }
      });

      /**************************************
          When the dragging of the object is finished
      ***************************************/
      this.canvas.on('object:modified', function(evt) {

        if(evt.target) {

          var step, me;
          switch(evt.target.name) {

            case "controlCircleGroup":

              me = evt.target.me;
              var targetCircleGroup = evt.target;
              var temp = evt.target.me.temperature.text;
              ExperimentLoader.changeTemperature($scope)
                .then(function(data) {
                  console.log(data);
              });
            break;

            case "dragStepGroup":

              var indicate = evt.target;
              step = indicate.currentStep;
              indicate.setVisible(false);
              step.commonFooterImage.setVisible(true);
              indicate.endPosition = indicate.left;
              indicate.processMovement(step, C);
              C.canvas.renderAll();
            break;

            case "dragStageGroup":

              var indicateStage = evt.target;
              step = indicateStage.currentStep;
              indicateStage.setVisible(false);
              indicateStage.endPosition = indicateStage.left;
              indicateStage.processMovement(step.parentStage, C);
              C.canvas.renderAll();
            break;

          }

        }
      });

      /**************************************
          A tricky one, fired from the DOM perspective. When we have long
          canvas and when we scroll canvas recalculate the offset.
      ***************************************/
      $(".canvas-containing").scroll(function(){
        C.canvas.calcOffset();
      });

      /**************************************
           When all the images are loaded up
           We fire this event
           Note that it takes some more time to load images, better avaoid images
           or wait for images to complete
      ***************************************/
      this.canvas.on("imagesLoaded", function() {
        C.addStages().setDefaultWidthHeight().addRampLinesAndCircles();
        C.selectStep();
        //C.addMoveStepIndicator();
        C.canvas.renderAll();
      });
    };
  }
]);
