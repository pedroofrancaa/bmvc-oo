from bottle import template


class Application():

    def __init__(self):
        self.pages = {
            'copa': self.copa,
        }


    def render(self, page):
        content = self.pages.get(page, self.helper)
        return content()


    def helper(self):
        return template('app/views/html/helper')


    def copa(self):
        return template('app/views/html/copa')
