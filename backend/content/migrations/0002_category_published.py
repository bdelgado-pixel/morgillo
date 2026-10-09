from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("content", "0001_initial")]

    operations = [
        migrations.AddField(
            model_name="category",
            name="published",
            field=models.BooleanField(
                "Publicada", default=True,
                help_text="Al desmarcarla, se ocultan esta categoría y sus equipos en la web. Los equipos conservan su propio estado de publicación y vuelven a mostrarse al publicar la categoría.",
            ),
        ),
    ]
