ESTIA_STATUS
============

Shows a very simple network and its packet loss the last 5 minutes

To set it up:

Place updateServerStatus.sh wherever, give it executable permissions and run it on boot as root. It will create the files /var/www/status/*.txt that correspond to the packet loss of each element of the network.

Place the file index.php, the paint.js and the status folder into /var/www

Restart your server in order to run updateServerStatus.sh and you're ready.
