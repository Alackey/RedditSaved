from django import template

register = template.Library()


@register.filter(name='unsave')
def unsave(post):
    print(post)
    return post
