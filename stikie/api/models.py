from django.contrib.auth import get_user_model
from django.db import models
from django.utils.timezone import now

User = get_user_model()


class Site(models.Model):
    """User registers his site"""
    url = models.CharField(max_length=1000, unique=True, null=False)
    owner = models.ForeignKey(User, related_name='sites', on_delete=models.CASCADE)


class Channel(models.Model):
    """User can create channels"""
    label = models.CharField(max_length=1000, null=False)
    participants = models.ManyToManyField(User)
    site = models.ForeignKey(User, related_name='channels', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('label', 'site')


class CommentTemplate(models.Model):
    """Allows user to provide his own templates"""
    html = models.TextField()


class Comment(models.Model):
    """Comment on a site that can belong to channel"""
    site = models.ForeignKey(Site, related_name='comments', on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, related_name='comments', on_delete=models.CASCADE)
    owner = models.ForeignKey(User, related_name='comments', on_delete=models.CASCADE)

    target_el_path = models.CharField(max_length=1000, unique=True, null=False)
    x_offset = models.CharField(max_length=100, null=False)
    y_offset = models.CharField(max_length=100, null=False)
    text = models.TextField()

    created_date = models.DateTimeField(default=now)
    template = models.ForeignKey(CommentTemplate, related_name='comments', on_delete=models.CASCADE)
