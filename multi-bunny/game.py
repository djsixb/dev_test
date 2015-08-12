__author__ = 'chul'

from javascript import JSConstructor
from browser import document
from browser import websocket

WIDTH = 800
HEIGHT = 600

stage = JSConstructor(PIXI.Stage)(0xFFFFAA)
renderer = JSConstructor(PIXI.autoDetectRenderer)(WIDTH, HEIGHT)
# renderer = JSConstructor(PIXI.autoDetectRenderer)(400, 400, doc['myStage'])
document.body.addpendChild(renderer.view)

texture = JSConstructor(PIXI.Texture.fromImage)('img/bunny.png')
background = JSConstructor(PIXI.Texture.fromImage)('img/grass.png')
bullet_texture = JSConstructor(PIXI.Texture.fromImage)('img/bullet.png')

other_players = {}
bullets = {}

namespace = "/game"
my_name = "undefined :) "
socket = JSConstructor(io.connect)('http://' + document.domain + ':5000'  + namespace)
JSConstructor(console.log)('http://' + document.domain + ':5000'  + namespace)

background_sprite = JSConstructor(PIXI.Sprite)(background);
stage.addChild(background_sprite)

main_player = undefined

Bullet = JSConstructor(PIXI.sprite)(texture)
Bullet.anchor.x = 0.5
Bullet.anchor.y = 0.5


def MainPlayer(texture, player_name, c_stage):
    mainPlayer = JSConstructor(PIXI.sprite)(texture)

    mainPlayer.anchor.x = 0.5
    mainPlayer.anchor.y = 0.5
    mainPlayer.direction = "right"
    mainPlayer.speed = 4
    mainPlayer.r_speed = 0.09
    mainPlayer.r_limit = 0.3
    mainPlayer.position.x = WIDTH / 2
    mainPlayer.position.y = HEIGHT / 2
    mainPlayer.add_title()
    mainPlayer.text.position.y = @position.y - 40
    mainPlayer.text.position.x = @position.x - 25
    mainPlayer.looking = "right"

    # font = {font:"13.5px Tahoma", fill:"white"}
    mainPlayer.text = JSConstructor(PIXI.Text)(player_name)
    c_stage.addChild(mainPlayer.text)

    mainPlayer.text.setText(player_name)

    if mainPlayer.rotation > mainPlayer.r_limit:
        mainPlayer.direction = "right"
    elif mainPlayer.rotation < -mainPlayer.r_limit:
        mainPlayer.direction = "left"

    mainPlayer.text.position.y = mainPlayer.position.y - 40
    mainPlayer.text.position.x = mainPlayer.position.x - 25

    if mainPlayer.direction == "right":
        mainPlayer.rotation -= mainPlayer.r_speed
    elif mainPlayer.direction == "left":
        mainPlayer.rotation += mainPlayer.r_speed


# sprite.anchor.x = sprite.anchor.y = 0.5
# sprite.position.x = sprite.position.y = 200
# sprite.scale.x = sprite.scale.y = 0.5
#
# stage.addChild(sprite)

# def animate(i):
#     # sprite.position.x -= 0.128
#     sprite.rotation += 0.1
#
#     global id
#     id = raf(animate)
#     renderer.render(stage)
#
# animate(0)