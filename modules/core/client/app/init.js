'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

// // Including ngTranslate
// angular.module("ngTranslate",["ng"]).config(["$provide",
//   function(t){$TranslateProvider=function(){var t,n={};
//     this.translations=function(t,r){if(!t&&!r)return n;
//       if(t&&!r){if(angular.isString(t))return n[t];
//         n=t}else n[t]=r},this.uses=function(r){if(!r)return t;
//           if(!n[r])throw Error("$translateProvider couldn't find translationTable for langKey: '"+r+"'");t=r},this.$get=["$interpolate","$log",function(r,a){return $translate=function(e,i){var l=t?n[t][e]:n[e];
//             return l?r(l)(i):(a.warn("Translation for "+e+" doesn't exist"),e)},$translate.uses=function(n){return n?(t=n,void 0):t},$translate}]},t.provider("$translate",$TranslateProvider)}]),angular.module("ngTranslate").directive("translate",["$filter","$interpolate",function(t,n){var r=t("translate");return{restrict:"A",scope:!0,link:function(t,a,e){e.$observe("translate",function(r){t.translationId=angular.equals(r,"")?n(a.text())(t.$parent):r}),e.$observe("values",function(n){t.interpolateParams=n}),t.$watch("translationId + interpolateParams",function(){a.html(r(t.translationId,t.interpolateParams))})}}}]),angular.module("ngTranslate").filter("translate",["$parse","$translate",function(t,n){return function(r,a){return angular.isObject(a)||(a=t(a)()),n(r,a)}}]);


// Configuring $translateProvider
// angula.config(['$translateProvider', function ($translateProvider) {
    
//     // Simply register translation table as object hash
//     $translateProvider.translations('en_EN', {
//         'HEADLINE': 'Introducing ngTranslate',
//         'SUB_HEADLINE': 'Translations for your Angular Apps!',
//         'AUTHOR_NAME': 'Pascal Precht',
//         'GITHUB_LINK_TEXT': 'View source on GitHub',
//         'GETTING_STARTED_HEADLINE': 'Getting Started',
//         'HEADLINE_FILTER': 'ngTranslate::translateFilter',
//         'HEADLINE_USAGE': 'Usage:',
//         'HEADLINE_FILTER_DYN_VALUES': 'Translations with dynamic values',
//         'INFO_TEXT_TRANSLATE_FILTER': 'ngTranslate comes with a filter you can use like this:',
//         'INFO_TEXT_TRANSLATE_FILTER_2': 'Sometimes you have translations were specific values can be dynamic. ngTranslate  comes with different ways to pass dynamic values into a translation.',
//         'INFO_TEXT_TRANSLATE_FILTER_3': 'First, a translation ID has to know that there is an optional dynamic value. Simply use string interpolation directive:',
//         'INFO_TEXT_TRANSLATE_FILTER_4': '"value" is now an identifier which you can assign values to. There are to ways to pass values through the translate filter. Using a string expression in JavaScript Object Notation and simply an object hash on the current scope.',
//         'HEADLINE_DIRECTIVE': 'ngTranslate::translateDirective',
//         'INFO_TEXT_TRANSLATE_DIRECTIVE': 'Sometimes filters are bad for your app because to many watch expressions slow down your app. So in that case, you might wanna use a directive. ngTranslate has you covered. You can use the translate directive in many different ways. Examples are shown below:',
//         'HEADLINE_DIRECTIVE_DYN_VALUES': 'Dealing with dynamic values',
//         'INFO_TEXT_TRANSLATE_DIRECTIVE_2': 'To pass values through translate directives you have to use the "values" attribute on the element you want to translate. You can either pass a string expression, just like the filter does, or an interpolated values from scope like shown below:',
//         'INFO_TEXT_TRANSLATE_DIRECTIVE_3': 'This works with every translation id combination.'
//     });   

//     $translateProvider.translations('de_DE', {
//         'HEADLINE': 'ngTranslate',
//         'SUB_HEADLINE': 'Internationalisierung für deine Angular Apps!',
//         'AUTHOR_NAME': 'Pascal Precht',
//         'GITHUB_LINK_TEXT': 'Code auf GitHub ansehen',
//         'GETTING_STARTED_HEADLINE': 'Starten',
//         'HEADLINE_FILTER': 'ngTranslate::translateFilter',
//         'HEADLINE_USAGE': 'Benutzung:',
//         'HEADLINE_FILTER_DYN_VALUES': 'Übersetzungen mit dynamischen Werten',
//         'INFO_TEXT_TRANSLATE_FILTER': 'ngTranslate bietet einen filter der wie folgt verwendet werden kann:',
//         'INFO_TEXT_TRANSLATE_FILTER_2': 'Manchmal haben Übersetzungen dynamische Werte. ngTranslate bietet mehrere Wege dynamische Werte an eine Übersetzung zu übergeben.',
//         'INFO_TEXT_TRANSLATE_FILTER_3': 'Zuerst muss eine Übersetzung wissen, dass sie dynamische Werte haben kann. Dazu kann einfach die bekannte Interpolation-Directive verwendet werden:',
//         'INFO_TEXT_TRANSLATE_FILTER_4': '"value" ist nun ein Identifier dem Werte zugewiesen werden können. Es gibt zwei Wegen, Werte durch einen Filter an einen Identifier zu geben. Zum einen sein String Ausdruck in Form eines Objektliterals, oder ein Objekthash am aktuellen Scope.',
//         'HEADLINE_DIRECTIVE': 'ngTranslate::translateDirective',
//         'INFO_TEXT_TRANSLATE_DIRECTIVE': 'Zu viele Filter können deine Angular App stark verlangsamen. In diesem Fall wäre es gut eine Direktive anstatt einen Filter zu verwenden. ngTranslate kommt mit einer "translate" Direktive, die in vielen verschiedenen Wegen verwendet werden kann:',
//         'HEADLINE_DIRECTIVE_DYN_VALUES': 'Mit dynamischen Werten umgehen',
//         'INFO_TEXT_TRANSLATE_DIRECTIVE_2': 'Um Werte durch die "translate" Direktive zu übergeben, wird das "values" Attribute verwendet. Auch hier kann entweder ein String Ausdruck oder eine Stringinterpolation verwendet werden:',
//         'INFO_TEXT_TRANSLATE_DIRECTIVE_3': 'Das funktioniert in allen Kombinationen.'
//     });   
    
//     $translateProvider.uses('en_EN');
// }]);

angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored 
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
});

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
