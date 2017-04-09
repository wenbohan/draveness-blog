---
layout: post
title: Persistent Storage with levelDB
date: 2014-12-12 03:18:56.000000000 +08:00
permalink: /:title
---


`LevelDB` is a key-value pair database developing by google. Why I use this instead of `Core Data` which is so widely used.

`Core Data` is a framework deals with data in `Cocoa`. It is extremly important but compliated. There are many concepts and problems in it. And every time I use `Core Data` to fetch some datas, I have to write couple lines code.

```
UIAppdelegate *appDelegate = [UIApplication sharedApplication].delegate;
NSManagedObjectContext *appDelegate = ApplicationDelegate.managedObjectContext;
NSError *error = nil;
NSFetchRequest *request = [[NSFetchRequest alloc] initWithEntityName:NSStringFromClass([Item class])];
NSArray *items  = [manageContext executeFetchRequest:request error:&error];
```
	
This is so complicated and not elegant. I prefer to use `key-value` storage instead of it in some situations. When data are not compliated and the relation between models are simple.

I use `levelDB` this way:

```
UIAppdelegate *appDelegate = [UIApplication sharedApplication].delegate;
[]appDelegate.db objectForKey:@"key"];
```

Just like dictionary and incredible simple to deal with.

Before using `LevelDB`, the first thing you need to do is downlod repo on github [`google/LevelDB`](https://github.com/google/leveldb) or type this in terminal

```
git clone https://github.com/google/leveldb.git
```
	
And then you need to compile it.

```
CXXFLAGS=-stdlib=libstdc++ make PLATFORM=IOS
```
	
Download the wrapper on this [tanhao](http://www.tanhao.me/pieces/1397.html) Just drag this all in your project.

The prepare work are all done.

But when I you this `levelDB` to store data, I met some problems, if you want to store some data which is an object, you should make the `class` of that `object` to confirm `NSCoding` protocol.

```
- (id)initWithCoder:(NSCoder *)decoder {
    self = [super init];
    if (!self) {
        return nil;
    }

    self.avatar = [decoder decodeObjectForKey:@"avatar"];
    self.nickName = [decoder decodeObjectForKey:@"nickName"];
    self.userID = [decoder decodeObjectForKey:@"userID"];
    self.comments = [decoder decodeObjectForKey:@"comments"];

    return self;
}

- (void)encodeWithCoder:(NSCoder *)encoder {
    [encoder encodeObject:self.avatar forKey:@"avatar"];
    [encoder encodeObject:self.nickName forKey:@"nickName"];
    [encoder encodeObject:self.userID forKey:@"userID"];
    [encoder encodeObject:self.comments forKey:@"comments"];
}
```

You need to implement this two methods, if not when you fetch the object from the data base, the compiler do not know what in it and what is it. So you should `encode` the object propety before store them. And `decode` the object when you fetch them. Work similar as `NSKeyedArchiver`, if we have dozens of property, we have to write code for every property, after I find that I have to solve this problem in this approach. I think I want to write a `Meta Propgram` in `Ruby` to deal with this.

And I will do it after my second App on line.
