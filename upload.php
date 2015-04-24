<?php
	file_put_contents('uploads/'.$_SERVER['XHR_FILENAME'], file_get_contents('php://input'));

	exit('ok')
?>