// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log('\x1b[33m%s\x1b[0m', err.stack);
    // render the error page
    res.status(err.status || 500);
    res.json({ status: 'error', message: err.message });
}

export default errorHandler;
