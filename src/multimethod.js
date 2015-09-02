/**
 * The arguments are an array of method definitions. With an
 * optional final function argument as the default function if
 * no other ones are handled.
 */
function multimethod() {
  var args  = Array.prototype.slice.call(arguments);

  checkMultiMethodArguments(args);

  var parsedArgs = parseArguments(args);
  var methodDescriptors = parsedArgs[0];
  var defaultMethod = parsedArgs[1];

  var groupedMethodDescriptors = groupByArgumentLength(methodDescriptors);

  return function() {
    var callArgs  = Array.prototype.slice.call(arguments);
    var methods = groupedMethodDescriptors[callArgs.length];

    if(!Array.isArray(methods)) { throw new Error('No methods match these arguments: %s', callArgs); }

    var handler = null;
    for(var mdIndex in methods) {
      var descriptor = methods[mdIndex];


      var fail = false;
      for(var index in callArgs) {
        // TODO: This only checks types
        if(descriptor[index] !== callArgs[index].constructor) {
          fail = true;
          break;
        }
      }

      if(!fail) { handler = descriptor[descriptor.length - 1]; } // Handler Found
    }
    
    handler = handler || defaultMethod;

    // TODO: Handle instance/context correctly
    executeResult(handler, callArgs);
  };
}

/**
 * Execute the result expression to get the final result.
 * This may be a method or a value.
 * @param {Function | *} resultHandler - The handler/result type.
 * @param {array} [args] - The args to pass to the hanlder if it is a function.
 * @returns The result of the execution.
 */
function executeResult(resultHandler, args) {
  if(typeof resultHandler === 'function') {
    resultHandler.apply(this, args); // TODO: replace this
  } else {
    return resultHandler; // It's an object
  }
}

/**
 * Check to make sure the arguments going into the multimethod
 * are of the correct format.
 * @param {Array} args - The arguments array to check.
 * @throws {Error} - If they are invalid.
 */
function checkMultiMethodArguments(args) {
  if(args.length <= 0) { throw new Error('Must have at least one method defined.'); }

  if(typeof args[0] !== 'function' && !Array.isArray(args[0])) {
    throw new Error('Must have function or descriptor array in multimethod.');
  }
}

/**
 * Group the methods based on the number of arguments they have.
 * @param {array} args - The arguments to group.
 * @returns {object} - Object where the keys are the number of arguments.
 */
function groupByArgumentLength(args) {
  var group = {};
  args.forEach(function(descriptor) {
    var argLength = descriptor.length - 1;
    if(!group[argLength]) { group[argLength] = [] }

    group[argLength].push(descriptor);
  });
  return group;
}

/**
 * Find all the methods with their handlers.
 * @param {Array} args - The arguments to pull the methods from.
 * @returns {array} - [method descriptors, default function]
 */
function parseArguments(args) {
  var last = args[args.length - 1];

  // TODO: Could the last default be a value instead of method?
  if(typeof last === 'function') { // Last method is default function
    return [args.slice(args, args.length - 1), last];
  }

  return [args, null];
}

module.exports = multimethod;
