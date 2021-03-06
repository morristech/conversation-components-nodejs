// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

process.env.DEBUG = 'actions-on-google:*';
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');

// Constants for Dialogflow Agent Actions
const BASIC_CARD = 'basic.card';
const BROWSE_CAROUSEL = 'browse.carousel';
const BYE_CARD = 'bye.card';
const BYE_RESPONSE = 'bye.response';
const CARD_BUILDER = 'card.builder';
const CAROUSEL = 'carousel';
const ITEM_SELECTED = 'item.selected';
const LIST = 'list';
const MEDIA_RESPONSE = 'media.response';
const MEDIA_STATUS = 'media.status';
const NORMAL_ASK = 'normal.ask';
const NORMAL_BYE = 'normal.bye';
const SUGGESTIONS = 'suggestions';
const WELCOME = 'input.welcome';

// Constants for list and carousel selection
const SELECTION_KEY_GOOGLE_ALLO = 'googleAllo';
const SELECTION_KEY_GOOGLE_HOME = 'googleHome';
const SELECTION_KEY_GOOGLE_PIXEL = 'googlePixel';
const SELECTION_KEY_ONE = 'title';

// Constant for image URLs
const IMG_URL_AOG = 'https://developers.google.com/actions/images/badges' +
  '/XPM_BADGING_GoogleAssistant_VER.png';
const IMG_URL_GOOGLE_ALLO = 'https://allo.google.com/images/allo-logo.png';
const IMG_URL_GOOGLE_HOME = 'https://lh3.googleusercontent.com' +
  '/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw';
const IMG_URL_GOOGLE_PIXEL = 'https://storage.googleapis.com/madebygoog/v1' +
  '/Pixel/Pixel_ColorPicker/Pixel_Device_Angled_Black-720w.png';
const IMG_URL_MEDIA = 'http://storage.googleapis.com/automotive-media/album_art.jpg';

const MEDIA_SOURCE = 'http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3';

const intentSuggestions = [
    'Basic Card',
    'Browse Carousel',
    'Carousel',
    'List',
    'Media',
    'Suggestions'
];


exports.conversationComponent = functions.https.onRequest((req, res) => {
  const app = new DialogflowApp({request: req, response: res});
  console.log('Request headers: ' + JSON.stringify(req.headers));
  console.log('Request body: ' + JSON.stringify(req.body));

  // Welcome
  function welcome (app) {
    app.ask(app.buildRichResponse()
      .addSimpleResponse({speech: 'Hi there!', displayText: 'Hello there!'})
      .addSimpleResponse({
        speech: 'I can show you basic cards, lists and carousels as well as ' +
          'suggestions on your phone',
        displayText: 'I can show you basic cards, lists and carousels as ' +
          'well as suggestions'})
        .addSuggestions(intentSuggestions));
  }

  function normalAsk (app) {
    app.ask('Ask me to show you a list, carousel, or basic card');
  }

   // Suggestions
  function suggestions (app) {
    app.ask(app
      .buildRichResponse()
      .addSimpleResponse('This is a simple response for suggestions')
      .addSuggestions('Suggestion Chips')
      .addSuggestions(intentSuggestions)
      .addSuggestionLink('Suggestion Link', 'https://assistant.google.com/'));
  }

  // Basic card
  function basicCard (app) {
    app.ask(app.buildRichResponse()
      .addSimpleResponse('This is the first simple response for a basic card')
      .addSuggestions(intentSuggestions)
        // Create a basic card and add it to the rich response
      .addBasicCard(app.buildBasicCard(`This is a basic card.  Text in a
      basic card can include "quotes" and most other unicode characters
      including emoji 📱.  Basic cards also support some markdown
      formatting like *emphasis* or _italics_, **strong** or __bold__,
      and ***bold itallic*** or ___strong emphasis___ as well as other things
      like line  \nbreaks`) // Note the two spaces before '\n' required for a
                            // line break to be rendered in the card
        .setSubtitle('This is a subtitle')
        .setTitle('Title: this is a title')
        .addButton('This is a button', 'https://assistant.google.com/')
        .setImage(IMG_URL_AOG, 'Image alternate text'))
      .addSimpleResponse({ speech: 'This is the 2nd simple response ',
        displayText: 'This is the 2nd simple response' })
    );
  }

  // List
  function list (app) {
    app.askWithList(app.buildRichResponse()
      .addSimpleResponse('This is a simple response for a list')
      .addSuggestions(intentSuggestions),
      // Build a list
      app.buildList('List Title')
        // Add the first item to the list
        .addItems(app.buildOptionItem(SELECTION_KEY_ONE,
          ['synonym of title 1', 'synonym of title 2', 'synonym of title 3'])
          .setTitle('Title of First List Item')
          .setDescription('This is a description of a list item')
          .setImage(IMG_URL_AOG, 'Image alternate text'))
        // Add the second item to the list
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_HOME,
          ['Google Home Assistant', 'Assistant on the Google Home'])
          .setTitle('Google Home')
          .setDescription('Google Home is a voice-activated speaker powered ' +
            'by the Google Assistant.')
          .setImage(IMG_URL_GOOGLE_HOME, 'Google Home')
        )
        // Add third item to the list
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_PIXEL,
          ['Google Pixel XL', 'Pixel', 'Pixel XL'])
          .setTitle('Google Pixel')
          .setDescription('Pixel. Phone by Google.')
          .setImage(IMG_URL_GOOGLE_PIXEL, 'Google Pixel')
        )
        // Add last item of the list
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_ALLO, [])
          .setTitle('Google Allo')
          .setDescription('Introducing Google Allo, a smart messaging app ' +
            'that helps you say more and do more.')
          .setImage(IMG_URL_GOOGLE_ALLO, 'Google Allo Logo')
          .addSynonyms('Allo')
        )
    );
  }

  // Carousel
  function carousel (app) {
    app.askWithCarousel(app.buildRichResponse()
      .addSimpleResponse('This is a simple response for a carousel')
      .addSuggestions(intentSuggestions),
      app.buildCarousel()
        // Add the first item to the carousel
        .addItems(app.buildOptionItem(SELECTION_KEY_ONE,
          ['synonym of title 1', 'synonym of title 2', 'synonym of title 3'])
          .setTitle('Title of First List Item')
          .setDescription('This is a description of a carousel item')
          .setImage(IMG_URL_AOG, 'Image alternate text'))
        // Add the second item to the carousel
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_HOME,
          ['Google Home Assistant', 'Assistant on the Google Home'])
          .setTitle('Google Home')
          .setDescription('Google Home is a voice-activated speaker powered ' +
            'by the Google Assistant.')
          .setImage(IMG_URL_GOOGLE_HOME, 'Google Home')
        )
        // Add third item to the carousel
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_PIXEL,
          ['Google Pixel XL', 'Pixel', 'Pixel XL'])
          .setTitle('Google Pixel')
          .setDescription('Pixel. Phone by Google.')
          .setImage(IMG_URL_GOOGLE_PIXEL, 'Google Pixel')
        )
        // Add last item of the carousel
        .addItems(app.buildOptionItem(SELECTION_KEY_GOOGLE_ALLO, [])
          .setTitle('Google Allo')
          .setDescription('Introducing Google Allo, a smart messaging app ' +
            'that helps you say more and do more.')
          .setImage(IMG_URL_GOOGLE_ALLO, 'Google Allo Logo')
          .addSynonyms('Allo')
        )
    );
  }

  // Browse Carousel
  function browseCarousel (app) {
    const a11yText = 'Google Assistant Bubbles';
    const googleUrl = 'https://google.com';
    app.ask(app.buildRichResponse()
        .addSimpleResponse('This is an example of a "Browse Carousel"')
        .addBrowseCarousel(
            app.buildBrowseCarousel()
            .addItems([
              app.buildBrowseItem('Title of item 1', googleUrl)
                .setDescription('Description of item 1')
                .setImage(IMG_URL_AOG , a11yText)
                .setFooter('Item 1 footer'),
              app.buildBrowseItem('Title of item 2', googleUrl)
                .setDescription('Description of item 2')
                .setImage(IMG_URL_AOG, a11yText)
                .setFooter('Item 2 footer')
            ])
        )
    );
  }

  // React to list or carousel selection
  function itemSelected (app) {
    const param = app.getSelectedOption();
    console.log('USER SELECTED: ' + param);
    if (!param) {
      app.ask('You did not select any item from the list or carousel');
    } else if (param === SELECTION_KEY_ONE) {
      app.ask('You selected the first item in the list or carousel');
    } else if (param === SELECTION_KEY_GOOGLE_HOME) {
      app.ask('You selected the Google Home!');
    } else if (param === SELECTION_KEY_GOOGLE_PIXEL) {
      app.ask('You selected the Google Pixel!');
    } else if (param === SELECTION_KEY_GOOGLE_ALLO) {
      app.ask('You selected Google Allo!');
    } else {
      app.ask('You selected an unknown item from the list or carousel');
    }
  }

  // Media response
  function mediaResponse (app) {
    app.ask(app.buildRichResponse()
      .addSimpleResponse('This is the first simple response for a media response')
      .addMediaResponse(app.buildMediaResponse()
        .addMediaObjects(
          app.buildMediaObject('Jazz in Paris', MEDIA_SOURCE)
            .setDescription('A funky Jazz tune')
            .setImage(IMG_URL_MEDIA, app.Media.ImageType.ICON)
        ))
      .addSuggestions(intentSuggestions)
    );
  }

  // Handle a media status event
  function mediaStatus (app) {
    const status = app.getMediaStatus();
    const simpleResponse = status === app.Media.Status.FINISHED
      ? 'Hope you enjoyed the tunes!'
      : 'Unknown media status received.';
    app.ask(app.buildRichResponse()
      .addSimpleResponse(simpleResponse)
      .addSuggestions(intentSuggestions));
  }

  // Recive a rich response from Dialogflow and modify it
  function cardBuilder (app) {
    app.ask(app.getIncomingRichResponse()
      .addBasicCard(app.buildBasicCard(`Actions on Google let you build for
       the Google Assistant. Reach users right when they need you. Users don’t
       need to pre-enable skills or install new apps.  \n  \nThis was written
       in the fulfillment webhook!`)
        .setSubtitle('Engage users through the Google Assistant')
        .setTitle('Actions on Google')
        .addButton('Developer Site', 'https://developers.google.com/actions/')
        .setImage('https://lh3.googleusercontent.com/Z7LtU6hhrhA-5iiO1foAfGB' +
          '75OsO2O7phVesY81gH0rgQFI79sjx9aRmraUnyDUF_p5_bnBdWcXaRxVm2D1Rub92' +
          'L6uxdLBl=s1376', 'Actions on Google')));
  }

  // Leave conversation with card
  function byeCard (app) {
    app.tell(app.buildRichResponse()
      .addSimpleResponse('Goodbye, World!')
      .addBasicCard(app.buildBasicCard('This is a goodbye card.')));
  }

  // Leave conversation with SimpleResponse
  function byeResponse (app) {
    app.tell({speech: 'Okay see you later',
      displayText: 'OK see you later!'});
  }

  // Leave conversation
  function normalBye (app) {
    app.tell('Okay see you later!');
  }

  const actionMap = new Map();
  actionMap.set(WELCOME, welcome);
  actionMap.set(NORMAL_ASK, normalAsk);
  actionMap.set(BASIC_CARD, basicCard);
  actionMap.set(LIST, list);
  actionMap.set(ITEM_SELECTED, itemSelected);
  actionMap.set(CAROUSEL, carousel);
  actionMap.set(BROWSE_CAROUSEL, browseCarousel);
  actionMap.set(SUGGESTIONS, suggestions);
  actionMap.set(BYE_CARD, byeCard);
  actionMap.set(NORMAL_BYE, normalBye);
  actionMap.set(BYE_RESPONSE, byeResponse);
  actionMap.set(CARD_BUILDER, cardBuilder);
  actionMap.set(MEDIA_RESPONSE, mediaResponse);
  actionMap.set(MEDIA_STATUS, mediaStatus);

  app.handleRequest(actionMap);
});
