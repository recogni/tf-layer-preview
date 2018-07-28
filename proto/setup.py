from setuptools import setup
from setuptools import find_packages

setup(name="layer_preview_proto",
      version="0.0.1",
      description="tf-layer-preview protobuffer definition library",
      url="https://github.com/recogni/tf-layer-preview",
      author="sabhiram",
      install_requires=[
      ],
      packages=["layer_preview_proto"],
      package_dir={"layer_preview_proto": "gen/py"})
