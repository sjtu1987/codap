// ==========================================================================
//                              DG.Drag
//
//  Author:   William Finzer
//
//  Copyright (c) 2014 by The Concord Consortium, Inc. All rights reserved.
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

/*
 * We override SC.Drag for the single purpose of dealing with overlapping drop targets
 * in the graph. Different browsers seem to produce different results with the SC.Drag
 * implementation. Namely, for one browser, the AxisMultiTarget will allow a drop while
 * for another browser it won't.
 */

/** @class  Override the private method _findDropTarget

*/
DG.Drag = SC.Drag.extend({

  _findDropTarget: function( iEvent) {
    var tTargets = this._dropTargets(),
        tLoc = { x: iEvent.pageX, y: iEvent.pageY },
        tResult = null;
    tTargets.forEach( function( iTarget) {
      if( (iTarget.constructor === DG.AxisMultiTarget) || (iTarget.get('orientation') === 'vertical2')) {
        var tFrame = iTarget.parentView.convertFrameToView( iTarget.get('frame'), null);
        if( SC.pointInRect( tLoc, tFrame)) {
          tResult = iTarget;
        }
      }
    });
    if( !SC.none( tResult))
      return tResult;
    else
      return sc_super();
  },

  /** @private Called instead of _destroyGhostView if slideBack is YES.
   *  Overridden to get a better destination for the slideBack than SC provides
   * */
  _slideGhostViewBack: function () {
    if( !this.origin)
        sc_super();
    else if (this.ghostView) {
      var slidebackLayout = { top: this.origin.y, left: this.origin.x };

      // Animate the ghost view back to its original position; destroy after.
      this.ghostView.animate(slidebackLayout, 0.5, this, function () {
        this.invokeNext(function() {
          // notify the source that slideback has completed
          var source = this.get('source');
          if (this.get('slideBack') && source && source.dragSlideBackDidEnd)
            source.dragSlideBackDidEnd(this);
          this._endDrag();
        });
      });

    }
    else {
      this._endDrag();
    }
  }
});
