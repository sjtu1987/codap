// ==========================================================================
//                          DG.LSRLModel
//
//  Author:   William Finzer
//
//  Copyright (c) 2016 by The Concord Consortium, Inc. All rights reserved.
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// ==========================================================================

sc_require('components/graph/adornments/twoD_line_model');

/** @class  DG.LSRLModel - The model for a least squares regression line.

 @extends DG.TwoDLineModel
 */
DG.LSRLModel = DG.TwoDLineModel.extend(
    /** @scope DG.TwoDLineModel.prototype */
    {
      /**
       We compute the slope and intercept of the lsrl for the displayed points
       */
      recomputeSlopeAndIntercept: function () {

        var getValuePairs = function() {
          var tValues = [],
              tCases = this.getPath('plotModel.cases'),
              tXVarID = this.getPath('plotModel.xVarID'),
              tYVarID = this.getPath('plotModel.yVarID');
          if( Array.isArray(tCases)) {
            tCases.forEach(function (iCase) {
              var tXValue = iCase.getNumValue(tXVarID),
                  tYValue = iCase.getNumValue(tYVarID);
              if (isFinite(tXValue) && isFinite(tYValue)) {
                tValues.push({x: tXValue, y: tYValue});
              }
            });
          }
          return tValues;
        }.bind( this);

        var tInterceptIsLocked = this.get('isInterceptLocked'),
            tSlopeIntercept = DG.MathUtilities.leastSquaresLinearRegression( getValuePairs(), tInterceptIsLocked);
        if( isNaN(tSlopeIntercept.slope) && isNaN( this.get('slope')) ||
            isNaN(tSlopeIntercept.intercept) && isNaN( this.get('intercept'))) {
          return; // not covered by setIfChanged
        }
        this.beginPropertyChanges();
          this.setIfChanged('slope', tSlopeIntercept.slope);
          this.setIfChanged('intercept', tSlopeIntercept.intercept);
          this.setIfChanged('isVertical', !isFinite(tSlopeIntercept.slope));
          this.setIfChanged('xIntercept', null);
        this.endPropertyChanges();
      }

    });

