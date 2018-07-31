#!/usr/bin/env python

import tensorflow as tf
from tf_layer_preview import PreviewServer


def generator():
    for i in range(1, 100, 1):
        yield "This is message %d with some awesome data" % (i), i


def main():
    o_types = (tf.string, tf.int64)
    dataset = tf.data.Dataset.from_generator(generator, output_types=o_types)
    dataset = dataset.batch(2)
    iter    = dataset.make_one_shot_iterator()
    x, y    = iter.get_next()
    z       = tf.constant(10.0, shape=[10, 10], dtype=tf.float32)

    preview = PreviewServer()
    x, y, z = preview.profile_ops(x, y, z, name="Profile X,Y,Z before print 1")
    x       = tf.Print(x, [x, y, z], "Print1=")
    x, y, z = preview.profile_ops(x, y, z, name="Profile X,Y,Z before print 2")
    x       = tf.Print(x, [x, y, z], "Print2=")

    # Run the session.
    with tf.Session() as sess:
        for i in range(2):
            sess.run(x)


if __name__ == "__main__":
    main()
