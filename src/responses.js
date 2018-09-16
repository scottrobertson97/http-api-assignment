const respond = (request, response, type, status, content) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

//success response with default message
const success = (request, response, acceptedTypes, params, message = 'This is a successful response.') => {
  //build xml
  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    //just add message
    responseXML = `${responseXML} <message>${message}</message>`;
    responseXML = `${responseXML} </response>`;
    //responf with 200 code
    return respond(request, response, 'text/xml', 200, responseXML);
  }
  // message to send
  const responseJSON = {
    message,
  };
  // send our json with a success status code
  return respond(request, response, 'application/json', 200, JSON.stringify(responseJSON));
};

//error response
const error = (request, response, acceptedTypes, params, message, id, statusCode) => {
  //construct xml reponse
  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    //add the message
    responseXML = `${responseXML} <message>${message}</message>`;
    //add the id
    responseXML = `${responseXML} <id>${id}</id>`;
    responseXML = `${responseXML} </response>`;
    //return xml error
    return respond(request, response, 'text/xml', statusCode, responseXML);
  }

  // error message with a description and consistent error id
  const responseJSON = {
    message,
    id,
  };

  // return our json with a error code
  return respond(request, response, 'application/json', statusCode, JSON.stringify(responseJSON));
};

// function to show bad request error
const badRequest = (request, response, acceptedTypes, params) => {
  //check perameter
  if (!params.valid || params.valid !== 'true') {
    return error(request, response, acceptedTypes, params,
      'Missing valid query parameter set to true.',
      'badRequest',
      400);
  }
  return success(request, response, acceptedTypes, params,
    'This request has the required parameters.');
};

// function to show unauthorized error
const unauthorized = (request, response, acceptedTypes, params) => {
  //check perameter
  if (params.loggedIn !== 'yes') {
    return error(request, response, acceptedTypes, params,
      'Missing loggedIn query parameter set to yes.',
      'unauthorized',
      401);
  }
  return success(request, response, acceptedTypes, params,
    'This request has the required parameters.');
};

// function to show forbidden error
const forbidden = (request, response, acceptedTypes, params) => {
  error(request, response, acceptedTypes, params,
    'You do not have access to this content.',
    'forbidden',
    403);
};

// function to show internal error
const internal = (request, response, acceptedTypes, params) => {
  error(request, response, acceptedTypes, params,
    'Internal Server Error. Something went wrong.',
    'internalError',
    500);
};

// function to show not implemented error
const notImplemented = (request, response, acceptedTypes, params) => {
  error(request, response, acceptedTypes, params,
    'A get request for this page has not been implemented yet. Check again later for updated content.',
    'notImplemented',
    501);
};

// function to show not found error
const notFound = (request, response, acceptedTypes, params) => {
  error(request, response, acceptedTypes, params,
    'The page you are looking for was not found.',
    'notFound',
    404);
};


// exports to set functions to public.
// In this syntax, you can do getCats:getCats, but if they
// are the same name, you can short handle to just getCats,
module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};