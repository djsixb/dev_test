__author__ = 'chul'

from browser import alert, document as doc
from browser import websocket
from javascript import JSConstructor

<canvas id="myStage" width="420" height="420"></canvas>

<script type="text/python">
    from javascript import JSConstructor
    from browser import doc
    from browser.timer import request_animation_frame as raf

    stage = JSConstructor(PIXI.Stage)(0x66FF99)
    renderer = JSConstructor(PIXI.autoDetectRenderer)(400, 400, doc['myStage'])

    p = "../../../../img/initializing@2x.png"

    texture = JSConstructor(PIXI.Texture.fromImage)(p)
    sprite = JSConstructor(PIXI.Sprite)(texture);

    sprite.anchor.x = sprite.anchor.y = 0.5
    sprite.position.x = sprite.position.y = 200
    sprite.scale.x = sprite.scale.y = 0.5

    stage.addChild(sprite)

    def animate(i):
        # sprite.position.x -= 0.128
        sprite.rotation += 0.1

        global id
        id = raf(animate)
        renderer.render(stage)

    animate(0)

</script>
<img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=http%3A%2F%2Fjsfiddle.net%2Fdirkk0%2Fs7butdL1%2Fshow%2F">