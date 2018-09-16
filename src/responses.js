const respond = (request, response, type, status, content) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const success = (request, response, acceptedTypes, params, message = 'This is a successful response.') => {
  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${message}</message>`;
    responseXML = `${responseXML} </response>`;
    return respond(request, response, 'text/xml', 200, responseXML);
  }
  // message to send
  const responseJSON = {
    message,
  };
  // send our json with a success status code
  return respond(request, response, 'application/json', 200, JSON.stringify(responseJSON));
};

const error = (request, response, acceptedTypes, params, message, id, statusCode) => {
  if (acceptedTypes[0] === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${message}</message>`;
    responseXML = `${responseXML} <id>${id}</id>`;
    responseXML = `${responseXML} </response>`;
    return respond(request, response, 'text/xml', statusCode, responseXML);
  }

  // error message with a description and consistent error id
  const responseJSON = {
    message,
    id,
  };

  // return our json with a 404 not found error code
  return respond(request, response, 'application/json', statusCode, JSON.stringify(responseJSON));
};

const badRequest = (request, response, acceptedTypes, params) => {
  if (!params.valid || params.valid !== 'true') {
    return error(request, response, acceptedTypes, params,
      'Missing valid query parameter set to true.',
      'badRequest',
      400);
  }
  return success(request, response, acceptedTypes, params,
    'This request has the required parameters.');
};

const unauthorized = (request, response, acceptedTypes, params) => {
  if (params.loggedIn !== 'yes') {
    return error(request, response, acceptedTypes, params,
      'Missing loggedIn query parameter set to yes.',
      'unauthorized',
      401);
  }
  return success(request, response, acceptedTypes, params,
    'This request has the required parameters.');
};

const forbidden = (request, response, acceptedTypes, params) => {
  error(request, response, acceptedTypes, params,
    'You do not have access to this content.',
    'forbidden',
    403);
};

const internal = (request, response, acceptedTypes, params) => {
  error(request, response, acceptedTypes, params,
    'Internal Server Error. Something went wrong.',
    'internalError',
    500);
};

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