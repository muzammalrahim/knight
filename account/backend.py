from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
import string, random
from django.core.mail import BadHeaderError, EmailMultiAlternatives


class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user
        return None


def send_emails(subject, html_content, to):

    # to = ['shaheroumwali@gmail.com']
    msg = EmailMultiAlternatives(subject, '', 'arslanmehmood051@gmail.com', to)
    msg.attach_alternative(html_content, "text/html")
    try:
        res = msg.send()
    except BadHeaderError:
        return res
    return res


def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))
