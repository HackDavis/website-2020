$(document).ready(function() 
{
    const URL = "https://server1.hackdavis.io:8080"; 
    const SOCKET = io.connect(URL, {secure: true});
    let isActive = true; // If this window is currently active
    let target_pos = {x: 0, y: 0};
    let last_sync_pos = {x: 0, y: 0};
    let last_update = GetSeconds();

    let my_id;
    let my_player;

    let players = []

    const movement_speed = 10

    const movement_keys = 
    {
        37: {x: -movement_speed, y: 0}, // Left
        38: {x: 0, y: -movement_speed}, // Up
        39: {x: movement_speed, y: 0}, // Right
        40: {x: 0, y: movement_speed} // Down
    }

    setInterval(() => {
        if (last_sync_pos.x != target_pos.x || last_sync_pos.y != target_pos.y)
        {
            last_sync_pos = JSON.parse(JSON.stringify(target_pos));
            SOCKET.emit('movement', JSON.stringify(target_pos));
        }
    }, 200);

    /**
     * Can be:
     * 
     * http://localhost:8080
     * or
     * http://ac.benankiel.com
     * 
     */


    SOCKET.on('connect', function()
    {
        console.log('Connected!');
    });

    SOCKET.on('disconnect', function()
    {
        $('div.player').remove();
        console.log(`Disconnected!`);
    });

    document.onkeydown = (e) => 
    {
        const keycode = (typeof e.which === 'number') ? e.which : e.keyCode;
        if (movement_keys[keycode])
        {
            MoveMyPlayer(movement_keys[keycode])
        }
    }

    function GetSeconds()
    {
        return new Date().getTime() / 1000;
    }

    /**
     * 
     * @param {*} msg 
     */
    function MoveMyPlayer(movement)
    {
        if (my_id == undefined || my_player.length == 0) {return;}

        // Move Player
        MovePlayer(movement, my_player);
    }

    function SetPlayerPosition(pos, player)
    {
        player.css('left', `${pos.x}px`);
        player.css('top', `${pos.y}px`);
    }

    function MovePlayer(movement, player)
    {
        target_pos.x += movement.x;
        target_pos.y += movement.y;
        SetPlayerPosition(target_pos, player);
    }

    SOCKET.on('moveplayer', function(data)
    {
        data = JSON.parse(data);

        const player = $(`div.player#${data.id}`);

        if (player.length == 0) {return;}

        if (data.id == my_id) {return;} // Don't move local player

        SetPlayerPosition(data.pos, player);
    });

    SOCKET.on('addplayer', function(data)
    {
        data = JSON.parse(data);
        AddPlayer(data);
    })

    SOCKET.on('set id', function(id)
    {
        my_id = id;
        my_player = $(`div.player#${id}`);
    })

    SOCKET.on('removeplayer', function(id)
    {
        $(`div.player#${id}`).remove();
    })

    function AddPlayer(data)
    {
        let p = $(`div.player#${data.id}`);
        
        if (p.length > 0) {return;} // Player already exists

        const $player = $(`<div class='player' id='${data.id}'></div>`);

        if (data.id == my_id)
        {
            my_player = $player;
            target_pos = data.pos;
            last_sync_pos = JSON.parse(JSON.stringify(target_pos));
        }

        $('body').append($player);
        SetPlayerPosition(data.pos, $player);
        return $player
    }

    SOCKET.on('update online', function(num_online)
    {
        $('div.online').text(`Players Online: ${num_online}`);
    })

    window.onmousemove = function () 
    {
        isActive = true;
     };
     
    window.onblur = function () 
    {
        isActive = false;
     };
})
